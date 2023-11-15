const colors = ["#CC004C", "#0089D0","#FCB711", "#6460AA","#F37021", "#0DB14B", "#f52394", "#00b2d4", "#90e200", "#afabf5"]

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
    var new_child = document.createElement('tr'),
        algorithm = document.querySelector('input[name = "algorithm"]:checked'),
        algorithm_null = algorithm ? algorithm.id: null;
        console.log(algorithm_null);
        str = `                            
            <td>
                P<sub>${fields.children.length + 1}</sub>
            </td>
            <td>
                <input type="number" step="1" placeholder="Enter a number" min="0" max="10000" required>
            </td>
            <td>
                <input type="number" step="1" placeholder="Enter a number" min="1" max="10000" required>
            </td>
            <td ${algorithm_null == "priority" ? "":  `style="display: none"`}>
                <input type="number" step="1" placeholder="Enter a number" min="1" max="10000" required ${algorithm_null == "priority" ? "": "disabled"}>
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
        new_child.lastChild.firstElementChild.style.backgroundColor = colors[fields.children.length]
        if(algorithm_null == "priority"){new_child.style.gridTemplateColumns = "0.4fr 1fr 1fr 1fr 0.4fr"};
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
        arrival = document.querySelectorAll(".styled-table tbody tr td:nth-child(2) input"),
        burst = document.querySelectorAll(".styled-table tbody tr td:nth-child(3) input"),
        priority = document.querySelectorAll(".styled-table tbody tr td:nth-child(4) input"),
        quantum = document.querySelector(".quantum input"),
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
 
    if(algorithm.id == "priority"){
        data_list["priority"] = []
        for(let i = 0; i < priority.length; i++){
            data_list.priority.push(parseInt(priority[i].value));
        };
    }

    if(algorithm.id == "round_robin"){data_list["quantum"] = parseInt(quantum.value)};

    eel.data(data_list)(finish);

    function finish(data){
        if(data[0]){
            var gantt_chart = JSON.parse(data[1]),
                result_table = JSON.parse(data[2]),
                result_container = document.querySelector(".results"),
                result_title = result_container.parentNode.firstElementChild,
                gantt_ul = document.createElement("ul"),
                table_body = document.querySelector(".result-styled-table tbody");
                
                for (let i = 0; i < gantt_chart.length; i++) {
                    var gantt_li = `<li ${i == 0 ? `data-start="${gantt_chart[i].key[0]}"`:``} 
                                        data-end="${gantt_chart[i].key[1]}"
                                        ${gantt_chart[i].value ? `data-process="${gantt_chart[i].value}"`: ""}
                                        ${gantt_chart[i].value ? `class="gantt${gantt_chart[i].value}"`: 'class="idle-process"'}
                                        ${gantt_chart[i].value ? `style="background-color:${colors[gantt_chart[i].value - 1]}"`: ""}>
                                        ${gantt_chart[i].value ? `P${gantt_chart[i].value}`: 'Idle'}
                                    </li>`;
                    gantt_ul.innerHTML += gantt_li;
                };

                result_container.firstElementChild.innerHTML = gantt_ul.outerHTML;
                result_container.firstElementChild.style.display = "flex";
                result_title.innerHTML = `Output - ${algorithm_type.id} ${algorithm.id.replaceAll("_", " ")}`
                
                table_body.innerHTML = "";
                for (let i = 0; i < result_table.completion_list.length; i++) {
                    var table_tr = document.createElement("tr"),
                        table_td = `<td>
                                        P<sub>${i + 1}</sub>
                                    </td>
                                    <td>${arrival[i].value}</td>
                                    <td>${burst[i].value}</td>
                                    <td>${result_table.completion_list[i]}</td>
                                    <td>${result_table.around_list[i]}</td>
                                    <td>${result_table.waiting_list[i]}</td>`;
                
                    table_tr.innerHTML = table_td;
                    table_tr.className = `process${i + 1}`;
                    table_tr.dataset.process = `${i + 1}`;
                    table_tr.style.backgroundColor = `${colors[i]}`;
                    table_body.appendChild(table_tr);
                };

                var table_tr = document.createElement("tr"),
                table_td_avg = `<td style="color: #535353 !important">Averages</td>
                            <td style="color: #535353 !important">${result_table.around_avg}</td>
                            <td style="color: #535353 !important">${result_table.waiting_avg}</td>`;
        
                table_tr.innerHTML = table_td_avg;
                table_tr.style.backgroundColor = `none`;
                table_tr.style.gridTemplateColumns = "4fr 1fr 1fr";
                table_body.appendChild(table_tr);

                table_body.parentNode.style.display = "grid";
            
            $('.loadOverlay').fadeOut();
            document.querySelector(".no-input").style.display = "none";

            const gantt_process = document.querySelectorAll(".results li");

            gantt_process.forEach(element => {
                element.addEventListener("mouseover", e => {
                    var process_count = e.target.dataset.process,
                        process_table = document.querySelector(`.process${process_count}`);

                        if(process_table) {process_table.style.transform = "scale(1.04)"};
                });

                element.addEventListener("mouseout", e => {
                    var process_count = e.target.dataset.process,
                        process_table = document.querySelector(`.process${process_count}`);
                        
                        if(process_table) {process_table.style.transform = "scale(1)"};
                });
            });

            const processes_table = document.querySelectorAll(".result-styled-table tbody tr");

            processes_table.forEach(element => {
                element.addEventListener("mouseover", e => {
                    e.stopImmediatePropagation();
                    var process_count = e.target.dataset.process,
                        process_gantt = document.querySelectorAll(`.gantt${process_count}`);
                        
                        if(process_gantt) {
                            for (let prcoess of process_gantt) {
                                prcoess.style.transform = "scale(1.1)";
                            };
                        };
                });

                element.addEventListener("mouseout", e => {
                    e.stopImmediatePropagation();
                    var process_count = e.target.dataset.process,
                        process_gantt = document.querySelectorAll(`.gantt${process_count}`);
                        
                        if(process_gantt) {
                            for (let prcoess of process_gantt) {
                                prcoess.style.transform = "scale(1)";
                            };
                        };    });
            });
        }else{
            $('.loadOverlay').fadeOut();
            message.firstElementChild.innerHTML = `Something Being Wrong!`;
            // message error
            $(message).addClass('message_animation')
            setTimeout(function(){
                $(message).removeClass('message_animation')
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

// hovering