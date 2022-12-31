const colors = ["#FCB711", "#6460AA","#F37021", "#0DB14B", "#f52394", "#00b2d4", "#90e200", "#c4c4c4"]

$(document).ready(function () {
    var content = document.querySelector('.allquiz');

    content.className += ' ready'
});

var fields = document.querySelector('.styled-table tbody'),
    content_inner = document.querySelector('.content_inner'),
    plus = document.querySelector('.plus_icon'),
    minus = document.querySelector('.minus_icon'),
    fields_form = document.querySelector('#fields_form'),
    message = document.querySelector('.message'),
    popup_img = document.querySelector('.popup_inner img'),
    popup_h3 = document.querySelector('.popup_inner h3'),
    popup_skatch = document.querySelector('.popup_skatch img');

$(plus).on('click',function(){
    console.log(fields.children)
    var new_child = document.createElement('tr'),
        str = `                            
            <td>
                P<sub>${fields.children.length + 1}</sub>
            </td>
            <td>
                <input type="number" step="1" placeholder="Enter a number" min="1" max="10000" required>
            </td>
            <td>
                <input type="number" step="1" placeholder="Enter a number" min="1" max="10000" required>
            </td>
            <td>
                <div class="process-color"></div>
            </td>`,
        count = document.querySelector('.count');
    if(fields.children.length + 1 <= 10){
        if(fields.children.length + 1 < 10 && fields.children.length + 1 > 2){
            $('.fa-plus').removeClass('hideen');
            $('.fa-minus').removeClass('hideen');
        }else if(fields.children.length + 1 == 10){
            $('.fa-plus').addClass('hideen');
            $('.fa-minus').removeClass('hideen');
        }
        new_child.innerHTML = str
        new_child.dataset.id = fields.children.length + 1
        new_child.lastChild.firstElementChild.style.backgroundColor = colors[fields.children.length - 2]
        count.innerHTML = fields.children.length + 1   
        fields.appendChild(new_child)
    }
});

$(minus).on('click',function(){
    var count = document.querySelector('.count');

    if(fields.children.length - 1 >= 2){
        if(fields.children.length - 1 < 10 && fields.children.length - 1 > 2){
            $('.fa-plus').removeClass('hideen');
            $('.fa-minus').removeClass('hideen');
        }else if(fields.children.length - 1 == 2){
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

fields_form.addEventListener('submit',function (e){ 
    e.preventDefault();

    // console.log();

    $('.loadOverlay').fadeIn();

    var algorithm_type = document.querySelector('input[name = "algorithm_type"]:checked'),
        algorithm = document.querySelector('input[name = "algorithm"]:checked'),
        arrival = document.querySelectorAll("tbody tr td:nth-child(2) input");
        burst = document.querySelectorAll("tbody tr td:nth-child(3) input");
        data_list = {
            "algorithm_type": null,
            "algorithm": null,
            "arrival": [],
            "burst": []
        };

    data_list.algorithm_type = algorithm_type.id;
    data_list.algorithm = algorithm.id;

    for(let i = 0; i < arrival.length; i++){
        data_list.arrival.push(parseInt(arrival[i].value));
    };

    for(let i = 0; i < burst.length; i++){
        data_list.burst.push(parseInt(burst[i].value));
    };

    console.log(data_list)

    eel.data(data_list)(finish);

    function finish(c){
        if(c[0]){
            // if(c[1] > 4){
            //     popup_img.src = './images/times.svg'
            //     popup_h3.innerHTML = 'The Patient Has Diabetes'
            // }else{
            //     popup_img.src = './images/correct.svg'
            //     popup_h3.innerHTML = 'The Patient Has Not Diabetes'
            // }
            // $('.loadOverlay').fadeOut(function(){
            //     $('.popup_result').fadeIn();
            // });
        }else{
            $('.loadOverlay').fadeOut();
            message.firstElementChild.innerHTML = `Something Being Wrong!`;
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

function getElementByXpath(path) {
    return document.evaluate(path, document, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
}