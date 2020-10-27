let cards = []
let tipOrder = 0

moment.locale('pt-BR')

initialize()

function CheckToday(){
    return [moment().format('DD'), moment().format('MM'), moment().format('YYYY')]
}

function systemConfig(){
    document.body.addEventListener('touchmove', function(e){ e.preventDefault(); });
    setInterval(()=>{
        document.querySelector('.container').scrollLeft = 100000
    })
}

function initialize(){
    if(localStorage.getItem('DateCards') === null){
        setTimeout(()=>{
            tipChange()
        },3000)
    } 
    if(cards[lastCard()] === undefined){
        if(localStorage.getItem('DateCards') !== null){
            cardStorage('get')
        }
        if(cards.length === 0){
            cards.push({
                dia:CheckToday(),
                list: ['']
            })
        }
    }
    systemConfig()
    card()
    list()
    initEvents()
    cardDate()
}

function cardStorage(act){
    if(act === 'set'){
        localStorage.setItem('DateCards', JSON.stringify(cards)) 
    }
    else if(act === 'get'){
        cards = checkEmpty()
        cardStorage('set')
    }
    else{
        console.error('Ação necessaria ou comando errado no storage')
    }
}

function checkEmpty(){
    let newCards = JSON.parse(localStorage.getItem('DateCards'))
    newCards.forEach((card, index)=>{
        if(card.list.length === 0){
            newCards.splice(index,1)
        }
    })
    return newCards
}

function card(){
    document.querySelector('.container > div').innerHTML = ''
    cards.forEach((card, index)=>{
        let box = document.createElement('div')
        box.classList.add('box-save')
        box.id = 'Box-' + index
        box.innerHTML = `
            <header><h1>Hoje eu...</h1><button><i class="fas fa-plus"></i></button></header>
            <main>
                <ul></ul>
            </main>
        `
        if(document.querySelector('.container > div').childElementCount > 0){
            document.querySelector('.container > div > div').before(box)  
        }
        else{
            document.querySelector('.container > div').appendChild(box)        
        }

    })
    document.querySelector('#Box-' + lastCard()).classList.add('today')
    changeTitle()
}



function changeTitle(){
    let ago = document.querySelectorAll('.box-save:not(.today)')
    ago.forEach((box)=>{
        let dia = cards[box.id.replace('Box-','')].dia[2] + cards[box.id.replace('Box-','')].dia[1] + cards[box.id.replace('Box-','')].dia[0]
        box.querySelector('header h1').innerHTML =  moment().subtract(lastCard(), 'day').fromNow().replace('h','H') + ', eu...'
    })
}

function list(){
    cards.forEach((card, cardIndex)=>{
        document.querySelector('#Box-'+ cardIndex + ' ul').innerHTML = ''
        card.list.forEach((text, textIndex)=>{
            if(text){
                let li = document.createElement('li')
                let span = document.createElement('span')
                span.id = `Span-${lastCard()}-${textIndex}`
                span.textContent = text
                li.appendChild(span)
                li.innerHTML += `<input type="text" name="" id="Input-${cardIndex}-${textIndex}">`
                document.querySelector('#Box-'+ cardIndex + ' ul').appendChild(li)
            }
            else{
                cards[lastCard()].list.splice(textIndex, 1)
                cardStorage('set')
            }
        })
    })
}

function initEvents(){
    function eventChange() {
        let liAll = document.querySelectorAll('.today ul li')
        liAll.forEach((li)=>{
            let span =  li.querySelector('span')
            let input =  li.querySelector('input')
    
            span.addEventListener('click',function (){
                let input = document.querySelector('#' + this.id.replace('Span','Input'))
                this.style.display = 'none'
                input.style.display = 'inline-block'
                input.value = this.textContent
                input.focus()
            })
    
            input.addEventListener('blur',function(){
                let span = document.querySelector('#' + this.id.replace('Input','Span'))
                span.style.display = 'inline-block'
                this.style.display = 'none'
                let listID = this.id.replace('Input-' + lastCard() + '-','')
                cards[lastCard()].list[listID] = this.value
                cardStorage('set')
                list()
                eventChange()
            })
    
            input.addEventListener('keyup',function(e){
                let span = document.querySelector('#' + this.id.replace('Input','Span'))
                if(e.code == 'Enter'){
                    span.style.display = 'inline-block'
                    this.style.display = 'none'
                }
            })
        })
    }
    function eventADD(){
        let btn =  document.querySelector('.today header button')

        btn.addEventListener('click',function(){
            if(cards[lastCard()].list.length < 12){
                let newID = lastCard() + '-' + (cards[lastCard()].list.length)
                let li = document.createElement('li')
                li.innerHTML = `
                 <span id="Span-${newID}"></span>
                 <input type="text" name="" id="Input-${newID}">
                `
                document.querySelector('.today ul').appendChild(li)
                let span = document.querySelector('#Span-' + newID)
                let input = document.querySelector('#Input-' + newID)
                span.style.display = 'none'
                input.style.display = 'inline-block'
                input.value = span.textContent
                input.focus()
        
                cards[lastCard()].list.push('')
                eventChange()
            }
        })
    }
    eventChange()
    eventADD()
}


function cardDate(){
    let dia;
    setInterval(()=>{
        dia = cards[lastCard()].dia
        if(dia[0] != moment().format('DD') || dia[1] != moment().format('MM') || dia[2] != moment().format('YYYY')){
            cards.push({
                dia:CheckToday(),
                list:[]
            })
            cardStorage('set')
            initialize()
        }
    })
}

function lastCard(){
    return cards.length - 1
}

function tipChange(){
    document.querySelector('.tip').style.display = 'block'
    let tipP = document.querySelector('.tip p')
    tipOrder+= 1
    switch(tipOrder){
        case 1:
            tipP.innerHTML = 'Novas notas são criadas todos os dias, para anotar sobre o seu dia'
            break
        case 2:
            tipP.innerHTML = 'Para adicionar mais linhas na lista basta clicar no botão de adicionar<span>(+)</span>'
            break
        default:
            document.querySelector('.tip').style.display = 'none'
    }
}
