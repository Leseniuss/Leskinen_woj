$().ready(() => {
    let astys = {};

    // haetaan asiakastyypit
    $.get({
        url: "http://127.0.0.1:3002/Types",
        success: (result) => {
            astys = result;
            result.forEach((r) => {
                let optstr = `<option value="${r.Avain}">${r.Lyhenne + " " + r.Selite}</option>`;
                $('#custType').append(optstr);
                $('#custCustType').append(optstr);
            });
        }
    });

    // haetaan data
    fetch = () => {
        $('#data tbody').empty();
        let sp = searcParameters();
        $.get({
            url: `http://127.0.0.1:3002/Customer?${sp}`,
            success: (result) => {
                showResultInTable(result, astys);

            }
        });
    }

    // bindataan click-event
    $('#searchBtn').click(() => {
        fetch();
    });

    // otetaan kaikki asiakaanlisäysformin elementit yhteen muuttujaan
    let allFields = $([])
        .add($('#custName'))
        .add($('#custAddress'))
        .add($('#custPostNbr'))
        .add($('#custPostOff'))
        .add($('#custCustType'));

    // luodaan asiakkaanlisäysdialogi
    let dialog = $('#addCustDialog').dialog({
        autoOpen: false,
        modal: true,
        resizable: false,
        minWidth: 400,
        width: 'auto',
        close: function () {
            form[0].reset();
            allFields.removeClass("ui-state-error");
        }
    });

    /*let dialog2 = $('#updateCustDialog').dialog({
        autoOpen: false,
        modal: true,
        resizable: false,
        minWidth: 400,
        width: 'auto',
        close: function () {
            form[0].reset();
            allFields.removeClass("ui-state-error");
        }
    }); */ 

    /*$(function() {
        $(".updateCustDialog").dialog({
            autoOpen : false,
            modal : true,
            resizable : false,
            minWidth : 400,
            width : 'auto'
            
        }); */

    // luodaan formi
    let form = dialog.find("form")
        .on("submit", (event) => {
            event.preventDefault();
            //if (validateAddCust(form)) {
            let param = dialog.find("form").serialize();
            addCust(param);
            // } 
        }
        );

    // tekee post-kutsun palvelimelle ja vastauksen saatuaan jatkaa
    addCust = (param) => {
        $.post("http://127.0.0.1:3002/Customer", param)
            .fail(function (data) {
                $('#addStatus').css("color", "red").text("Lisäämisessä tapahtui virhe: " + data.responseJSON.error).show();
            })
            .then((data) => {
                showAddCustStat(data);
                $('#addCustDialog').dialog("close");
                fetch();
            });
    }
    updateCust = () => {
        //var str = $(".form2").serialize();
        console.log(data);
        $.ajax({
            url: "http://localhost:3002/Customer/" + req.params.id,
            type: 'PUT',
        success: () => {
            fetch();
        }
    }).fail(function (err) {
        console.log("Error " + err);
    })
    
}

    // näyttää lisäyksen onnistumisen tai epäonnistumisen
    showAddCustStat = (data) => {
        if (data.status == 'ok') {
            $('#addStatus').css("color", "green").text("Asiakkaan lisääminen onnistui")
                .show().fadeOut(2000);
        } else {
            $('#addStatus').css("color", "red").text("Lisäämisessä tapahtui virhe: " + data.status_text).show();
        }
    }

    // avataan asiakkaanlisäysdialogi jos sitä ei ole jo avattu
    $('#addCustBtn').click(() => {
        const isOpen = $('#addCustDialog').dialog("isOpen");
        if (!isOpen) {
            $('#addCustDialog').dialog("open");
        }
    });
    
});


// tarkistaa onko dialogin kentät täytetty ja näyttää varoitukset jos ei
validateAddCust = (form) => {
    let inputs = form.find('input');
    let valid = true;
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].value == '') {
            inputs[i].classList.toggle("ui-state-error", true);
            valid = false;
        } else {
            inputs[i].classList.toggle("ui-state-error", false);
        }
    }
    if (form.find('select')[0].value === 'empty') {
        form.find('select')[0].classList.toggle("ui-state-error", true);
        valid = false;
    } else {
        form.find('select')[0].classList.toggle("ui-state-error", false);
    }
    if (valid) {
        $('#warning').hide();
        return true;
    }
    $('#warning').show();
    return false;
}

// palauttaa hakuparametri-stringin jos kentät eivät ole tyhjiä
searcParameters = () => {
    let str = '';
    if ($('#name').val().trim() != '') {
        let name = $('#name').val().trim();
        str += `nimi=${name}`;
    }
    if ($('#address').val().trim() != '') {
        let address = $('#address').val().trim();
        if (str !== '') {
            str += '&';
        }
        str += `osoite=${address}`;
    }
    if ($('#custType').val() !== null) {
        let custType = $('#custType').val();
        if (str !== '') {
            str += '&';
        }
        str += `asty_avain=${custType}`;
    }
    return str;
}

// tyhjentää data-tablen ja tuo haun tuloksen tableen
showResultInTable = (result, astys) => {
    $('#data tbody').empty();
    result.forEach(element => {
        let trstr = "<tr><td>" + element.nimi + "</td>\n";
        trstr += "<td>" + element.osoite + "</td>\n";
        trstr += "<td>" + element.postinro + "</td>\n";
        trstr += "<td>" + element.postitmp + "</td>\n";
        trstr += "<td>" + element.luontipvm + "</td>\n";
        astys.forEach(asty => {
            if (asty.Avain === element.asty_avain) {
                trstr += "<td>" + asty.Selite + "</td>";
            }
        });
        trstr += `<td><button onclick="deleteCustomer(${element.avain});" class="deleteBtn">Poista</button></td>`;
        trstr += `<td><button onclick="updateCustomer(${element.asty_avain}); updateCustomer2(${element.avain}); 
        updateCustomer3('${element.postinro}'); updateCustomer4('${element.nimi}'); 
        updateCustomer5('${element.postitmp}'); updateCustomer6('${element.osoite}'); 
        disableBtn();" class="addCustBtn" id="addCustBtn">Päivitä</button></td>`;
        trstr += "</tr>\n";
        $('#data tbody').append(trstr);
    });
}

updateCustomer = (avain) => {
    //$('#addCustDialog').dialog("open");
    //$('#custName').val($("#custName").val() + avain);
    $('#addCustDialog').dialog("open");
    $('#custCustType').val($("#custCustType").val() + avain);
    
}
updateCustomer2 = (avain) => {
    $('#avain').val($("#avain").val() + "Asiakas avain = " + avain);
    $.get({
        url: "http://127.0.0.1:3002/Customer/" + avain,
        success: (result) => {
            console.log(result)
            
        }
    }).fail(function (err) {
        console.log("Error " + err);
    })
    
}
updateCustomer3 = (avain) => {
    $('#custPostNbr').val($("#custPostNbr").val() + avain);
}
updateCustomer4 = (avain) => {
    $('#custName').val($("#custName").val() + avain);
}
updateCustomer5 = (avain) => {
    $('#custPostOff').val($("#custPostOff").val() + avain);
}
updateCustomer6 = (avain) => {
    $('#custAddress').val($("#custAddress").val() + avain);
}



function disableBtn() {
    addCustSubmit.disabled = true;
    updateBtn.disabled = false;
    
}


deleteCustomer = (avain) => {
    $.ajax({
        url: "http://localhost:3002/Customer/" + avain,
        type: 'DELETE',
        success: () => {
            fetch();
        }
    }).fail(function (err) {
        console.log("Error " + err);
    })

}

