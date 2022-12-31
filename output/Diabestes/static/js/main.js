$(document).ready(function () {
    var content = document.querySelector('.allquiz');

    content.className += ' ready'
});

var fields = document.querySelector('.all_fields'),
    content_inner = document.querySelector('.content_inner'),
    plus = document.querySelector('.plus_icon'),
    minus = document.querySelector('.minus_icon'),
    fields_form = document.querySelector('#fields_form'),
    message = document.querySelector('.message'),
    popup_img = document.querySelector('.popup_inner img'),
    popup_h3 = document.querySelector('.popup_inner h3'),
    popup_skatch = document.querySelector('.popup_skatch img');

$(plus).on('click',function(){
    var new_child = document.createElement('div'),
        str = `<div class="content_field"> <h3>t<sub>${fields.children.length+1}</sub></h3><input type="text" placeholder="Time (hr)"></div><div class="content_field"><h3>G<sub>${fields.children.length+1}</sub></h3><input type="text" placeholder="Glucose in the blood (mg/dl)"></div>`;
        str = `                            
        <div class="content_field">
            <h3>t<sub>${fields.children.length+1}</sub></h3>
            <input type="number" step="0.0000001" placeholder="Time (hr)"min="0" max="10000" required>
        </div>
        <div class="content_field">
            <h3>G<sub>${fields.children.length+1}</sub></h3>
            <input type="number" step="0.0000001" placeholder="Glucose in the blood (mg/dl)"min="0" max="10000" required>
        </div>`,
        count = document.querySelector('.count');
    if(fields.children.length + 1 <= 10){
        if(fields.children.length + 1 < 10 && fields.children.length + 1 > 5){
            $('.fa-plus').removeClass('hideen');
            $('.fa-minus').removeClass('hideen');
        }else if(fields.children.length + 1 == 10){
            $('.fa-plus').addClass('hideen');
            $('.fa-minus').removeClass('hideen');
        }
        new_child.className = 'content_inner'
        new_child.innerHTML = str
        new_child.dataset.id = fields.children.length+1
        count.innerHTML = fields.children.length+1   
        fields.appendChild(new_child)
    }
});

$(minus).on('click',function(){
    var count = document.querySelector('.count');

    if(fields.children.length - 1 >= 5){
        if(fields.children.length - 1 < 10 && fields.children.length - 1 > 5){
            $('.fa-plus').removeClass('hideen');
            $('.fa-minus').removeClass('hideen');
        }else if(fields.children.length - 1 == 5){
            $('.fa-plus').removeClass('hideen');
            $('.fa-minus').addClass('hideen');
        }
        count.innerHTML = fields.children.length-1   
        fields.removeChild(fields.lastChild)
    }
});

function consitions(inputs){
    for (let i = 0; i < inputs.length; i++) {
        var x = inputs[0];

        if(Math.abs(x) != x){

            break
        }
    }
}


$(fields_form).on('submit',function (e){ 
    e.preventDefault();

    $('.loadOverlay').fadeIn();

    var inputs = e.target.firstElementChild.querySelectorAll('input'),
        data_list = [];
    for(let i = 0; i < inputs.length; i++){
        data_list.push(inputs[i].value)
    }
    eel.data(data_list)(finish);
    function finish(c){
        console.log(c)
        if(c[0]){
            if(c[1] > 4){
                popup_img.src = './images/times.svg'
                popup_h3.innerHTML = 'The Patient Has Diabetes'
            }else{
                popup_img.src = './images/correct.svg'
                popup_h3.innerHTML = 'The Patient Has Not Diabetes'
            }
            $('.loadOverlay').fadeOut(function(){
                $('.popup_result').fadeIn();
            });
        }else{
            $('.loadOverlay').fadeOut();
            // message error
            $(message).addClass('message_animation')
            setTimeout(function(){
                $(message).removeClass('message_animation')
                console.log('finished')
            },5000)
        }
    }
});

$('.skatch').on('click', function(){
    popup_skatch.src = './plot/last_fig.jpg'
    $('.popup_result').fadeOut(function(){
        $('.popup_skatch').fadeIn();
    })
});

$('.times').on('click', function(){
    $('.popup_result').fadeOut();
})

$('.times2').on('click', function(){
    $('.popup_skatch').fadeOut();
})