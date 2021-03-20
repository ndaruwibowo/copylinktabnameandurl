var browser = chrome;

// �����ݱ��浽local storage��
function saveOptions(allData) {
    var allformats = Array();
    for (var i in allData) {
        var data = allData[i];
        var fobj = {};
        fobj.name = data[0]
        fobj.format = data[1]
        allformats[i] = fobj;
    }
    browser.storage.local.set({
        formats: JSON.stringify(allformats)
    });
}

// ��ȡ����
var getAllData = function(){
    var tb = document.getElementById('formats');
    var allData=[];
    var ctr = tb.childNodes;
    for(var i=0; i<ctr.length; i++){
        allData[i]=[];
        for(var j=0; j<ctr[i].children.length-1; j++){
            allData[i].push(ctr[i].children[j].children[0].firstChild.nodeValue.trim());
        }
    }
    return allData;
};

// ��ӱ���ȫ�����ݱ����¼�
function saveAllData(){
        var allData = getAllData();
        if(allData.length){
            saveOptions(allData)
        }else{
            //alert('No data!');
        }
};

function restoreOptions() {
    var saveAllBtn = document.getElementById('btnsave');
    saveAllBtn.onclick = saveAllData;

    var tb = document.getElementById('formats');
    var colnum = 3;
    var addBtn = document.getElementById('btnadd');
    
    var del = tb.getElementsByTagName('a');
    var span = tb.getElementsByTagName('span');
    
    var delEvent = function(){
        var dder = this.parentNode.parentNode;
        dder.parentNode.removeChild(dder);
    };
    // ��������޸Ŀ�
    var spanEvent = function(){
        var value = this.firstChild.nodeValue;
        var input = document.createElement('input');
        input.value = value;
        this.parentNode.appendChild(input);
        this.parentNode.removeChild(this);
        input.focus();
        // ʧȥ�����Ƴ��޸Ŀ�
        input.onblur = function(){
            var span = document.createElement('span');
            // ����޸��˵�Ԫ���Ĭ��ֵ������Ҳ����Ӧ�޸�
            span.appendChild(document.createTextNode(this.value?this.value:'null'));
            span.onclick =spanEvent;
            this.parentNode.appendChild(span);
            this.parentNode.removeChild(this);
        }
        input.onkeydown = function (e) {
        	if (!e) var e = window.event;
            var code;
        	if (e.keyCode) code = e.keyCode;
        	else if (e.which) code = e.which;
            if(code == 13)
        	{		
        		input.blur();
        		//return false;
        	}
        }
    };

    // ��������Ԫ������¼�
    for(var i in del) del[i].onclick = delEvent;
    for(var j in span) span[j].onclick = spanEvent;

    var strDel = browser.i18n.getMessage("stringDel");
    if (strDel.length==0) strDel = "Del";

    // Ĭ��ֵ���������޸ĵ�
    function* genSample(){
        yield 'markdown';
        yield '[%T](%U)';
    }
    addrow = function(){
        var tr = document.createElement('tr');
        let sample = genSample();
        for(var j=0; j<colnum; j++){
            var td = document.createElement('td');
            if(j==(colnum-1)){
                var del = document.createElement('a');
                del.href='javascript:;';
                del.appendChild(document.createTextNode(strDel));
                del.onclick = delEvent;// ���¼�Ԫ������¼�
                td.appendChild(del);
            }else{
                var span = document.createElement('span');
                span.appendChild(document.createTextNode(arguments[0] instanceof Array?arguments[0][j]:sample.next().value));
                td.appendChild(span);
                span.onclick =spanEvent;
            }
            tr.appendChild(td);
        }
        tb.appendChild(tr);
    };
    addBtn.onclick = addrow;

    var formats_query = browser.storage.local.get("formats",(result)=>{
        if (!result) {
            return
        }
        var formats = JSON.parse(result["formats"])
        for (var i in formats) {
            addrow(Array(formats[i].name, formats[i].format))
        }
    })
}




document.addEventListener('DOMContentLoaded', function(){
    restoreOptions();
    document.getElementById("formatname").innerText = browser.i18n.getMessage("stringFormatName");
    document.getElementById("format").innerText = browser.i18n.getMessage("stringFormat");
    document.getElementById("op").innerText = browser.i18n.getMessage("stringOp");
    
    document.getElementById("btnadd").innerText = browser.i18n.getMessage("stringAdd");
    document.getElementById("btnsave").innerText = browser.i18n.getMessage("stringSave");
});