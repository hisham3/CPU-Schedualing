// select//


$(".selected2").on('click',function(){

    $(".select_box2").toggleClass("active");
    $(".selected2 .fa-angle-up").toggleClass('active');
    $(".select_box3").removeClass("active");
    $(".selected3 .fa-angle-up").removeClass('active');

});


$(".body").on('click',function(){

    $(".select_box2").removeClass("active");
    $(".selected2 .fa-angle-up").removeClass('active');

});


$(".body .select_box2, .body .selected2").click (function(e){
    e.stopPropagation();
});

const select_container = document.querySelector(".select_container");
const options2 = document.querySelectorAll('.option2');
const selected = document.querySelector('.selected2 h4');
const options3 = document.querySelector(".option_container3");
const selected3 = document.querySelector('.selected3 h4');
const algorithms = {
    "preemptive": ["shotest job", "round robin", "priority", "round robin with priority"],
    "nonpreemptive": ["longest job", "shotest job", "first come first serve"]
}

options2.forEach(element => {
    element.addEventListener('click', function(){
        selected.innerHTML = element.querySelector('label').innerHTML;
        $(".select_box2").removeClass("active");
        $(".selected2 .fa-angle-up").removeClass('active');

        element.firstElementChild.checked = true;
        selected3.innerHTML = "Algorithm";
        options3.innerHTML = "";

        select_container.childNodes[5].style.display = "none";
        select_container.style.gridTemplateColumns = "1fr 1fr 0.4fr";

        for(i=0; i < algorithms[element.firstElementChild.id].length; i++){
            var algo = algorithms[element.firstElementChild.id][i],
            option3_child = document.createElement("div");
            option3_child.className = "option3 option"
            option3_child.innerHTML = `
                <input type="radio" class="radio" id="${algo.replaceAll(" ", "_")}" name='algorithm' required>
                <label for="${algo.replaceAll(" ", "_")}"><i class="fad fa-arrow-right"></i>${algo}</label>
            `
            options3.appendChild(option3_child);
        }

        options3.childNodes.forEach(el => {
            el.addEventListener('click', function(){
                selected3.innerHTML = el.querySelector('label').innerHTML;
                el.firstElementChild.checked = true;

                if(el.firstElementChild.id == "round_robin"){
                    select_container.childNodes[5].style.display = "block";
                    select_container.style.gridTemplateColumns = "1fr 1fr 0.4fr 0.4fr";
                }else{
                    select_container.childNodes[5].style.display = "none";
                    select_container.style.gridTemplateColumns = "1fr 1fr 0.4fr";
                }

                $(".select_box3").removeClass("active");
                $(".selected3 .fa-angle-up").removeClass('active');
            });
            
            el.firstElementChild.addEventListener("invalid", (e) => {
                if (e.target.name == "algorithm"){
                    $('.loadOverlay').fadeOut();
                    // message error
                    message.firstElementChild.innerHTML = `Please choose an algorithm`;
                    $(message).addClass('message_animation')
                    setTimeout(function(){
                        $(message).removeClass('message_animation')
                    },5000)
                };
            });
        });

        $(".selected3").removeClass('selected_block');
    });
});

// select//



// select2//

$(".selected3").on('click',function(){
    var checked = document.querySelector('input[name = "algorithm_type"]:checked');

    if(checked){
        $(".select_box3").toggleClass("active");
        $(".selected3 .fa-angle-up").toggleClass('active');
        $(".select_box2").removeClass("active");
        $(".selected2 .fa-angle-up").removeClass('active');
    }
});


$(".body").on('click',function(){

    $(".select_box3").removeClass("active");
    $(".selected3 .fa-angle-up").removeClass('active');

});


$(".select_box3, .selected3").click (function(e){
    e.stopPropagation();
});


// select2//
const input = document.querySelector('input')

input.addEventListener('invalid', (e) => {
    if (e.target.name == "algorithm_type"){
        $('.loadOverlay').fadeOut();
        // message error
        message.firstElementChild.innerHTML = `Please choose an algorithm type`;
        $(message).addClass('message_animation')
        setTimeout(function(){
            $(message).removeClass('message_animation')
        },5000)
    };
});