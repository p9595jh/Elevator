function info(userid) {
    window.open("./info?userid="+userid, "INFO", "width=500, height=600, left=300, top=100, scrollbars=yes, toolbars=no, location=no");
}

function playlist(userid) {
    window.open("./openplaylist?userid="+userid, "PLAYLIST", "width=500, height=600, left=300, top=100, scrollbars=yes, toolbars=no, location=no");
}

function makeLive(userid) {
    window.open("./live/make?userid="+userid, "LIVE", "width=500, height=600, left=300, top=100, scrollbars=yes, toolbars=no, location=no");
}

function viewLive(userid) {
    window.open("./live/view?userid="+userid, "LIVE", "width=500, height=600, left=300, top=100, scrollbars=yes, toolbars=no, location=no");
}

function confirmRemove() {
    return confirm("정말 삭제하시겠습니까?");
}

function recommend(boardtype, _id, id, count) {
    if ( boardtype == 'music' ) count = document.getElementById("grade").value;
    var data = { 'boardtype' : boardtype, '_id' : _id, 'id' : id, 'count' : count };
    data = JSON.stringify(data);

    var xhr = new XMLHttpRequest();
    xhr.open('POST', './ajax');
    xhr.setRequestHeader('Content-type', "application/json");
    xhr.send(data);

    if ( boardtype == 'music' ) {
        xhr.addEventListener('load', function() {
            var result = JSON.parse(xhr.responseText);
            var gradeSpan = document.getElementById('gradeSpan');
            gradeSpan.innerHTML = '평점 ' + result.grade + ' by ' + result.people + '명';
        });
    }
    else {
        xhr.addEventListener('load', function() {
            var result = JSON.parse(xhr.responseText);
            var btn = document.getElementById('recommendbtn');
            btn.innerHTML = '추천 ' + result.recommend;
        });
    }
}

function boardRequest(userid, _id) {
    var data = { 'userid' : userid, '_id' : _id };
    data = JSON.stringify(data);

    var xhr = new XMLHttpRequest();
    xhr.open('POST', './ajax/boardrequest');
    xhr.setRequestHeader('Content-type', "application/json");
    xhr.send(data);

    document.getElementById('boardRequest').style.display = "none";
}

function acceptBoardRequest(userid, _id) {
    var data = { 'userid' : userid, '_id' : _id };
    data = JSON.stringify(data);

    var xhr = new XMLHttpRequest();
    xhr.open('POST', './ajax/acceptboardrequest');
    xhr.setRequestHeader('Content-type', "application/json");
    xhr.send(data);

    document.getElementById('acceptBoardRequest').style.display = "none";
}

function subscribeBoard(userid, subid) {
    if ( !confirm("구독하시겠습니까?") ) return;

    var data = { 'userid' : userid, 'subid' : subid };
    data = JSON.stringify(data);

    var xhr = new XMLHttpRequest();
    xhr.open('POST', './ajax/subscribeboard');
    xhr.setRequestHeader('Content-type', "application/json");
    xhr.send(data);

    xhr.addEventListener('load', function() {
        var result = JSON.parse(xhr.responseText);
        if ( result.message == 'duplicated' )
            alert('이미 구독한 게시판입니다.');
        else if ( result.message == 'done' )
            window.location.reload(true);
    });
}

function stop(userid) {
    var administration = document.getElementById(userid + "button").innerHTML;
    if ( !confirm("'" + userid + "' " + administration + "하시겠습니까?") ) return;

    var data = { 'userid' : userid };
    data = JSON.stringify(data);

    var xhr = new XMLHttpRequest();
    xhr.open('POST', './ajax/stop');
    xhr.setRequestHeader('Content-type', "application/json");
    xhr.send(data);

    xhr.addEventListener('load', function() {
        var result = JSON.parse(xhr.responseText);
        if ( result.message != 'done' ) {
            alert('에러가 발생하였습니다!');
            return;
        }

        var text = document.getElementById(userid);
        var button = document.getElementById(userid + "button");

        if ( !result.stop ) {
            text.style.color = "black";
            button.innerHTML = "정지";
        }
        else {
            text.style.color = "red";
            button.innerHTML = "해제";
        }
    });
}

function substop(boardtype, userid) {
    var administration = document.getElementById(userid + "button").innerHTML;
    if ( !confirm("'" + userid + "' " + administration + "하시겠습니까?") ) return;

    var data = { 'boardtype' : boardtype, 'userid' : userid };
    data = JSON.stringify(data);

    var xhr = new XMLHttpRequest();
    xhr.open('POST', './ajax/substop');
    xhr.setRequestHeader('Content-type', "application/json");
    xhr.send(data);

    xhr.addEventListener('load', function() {
        var result = JSON.parse(xhr.responseText);
        if ( result.message != 'done' ) {
            alert('에러가 발생하였습니다!');
            return;
        }

        var text = document.getElementById(userid);
        var button = document.getElementById(userid + "button");

        if ( !result.stop ) {
            text.style.color = "black";
            button.innerHTML = "정지";
        }
        else {
            text.style.color = "red";
            button.innerHTML = "해제";
        }
    });
}

function find(type) {
    var code = document.getElementById("find" + type).value;
    if ( code == '' ) {
        alert('비어있습니다');
        return;
    }

    var data = { 'type' : type, 'code' : code };
    data = JSON.stringify(data);

    var xhr = new XMLHttpRequest();
    xhr.open('POST', './ajax/find');
    xhr.setRequestHeader('Content-type', "application/json");
    xhr.send(data);

    xhr.addEventListener('load', function() {
        var result = JSON.parse(xhr.responseText);
        var text = document.getElementById(type + "result");
        text.innerHTML = result.result;
    });
}

function reserve123(subid, userid) {
    var data = { 'subid' : subid, 'userid' : userid };
    console.log('????');

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '../ajax/reserve');
    xhr.setRequestHeader('Content-type', "application/json");
    xhr.send(data);

    xhr.addEventListener('load', function() {
        var result = JSON.parse(xhr.responseText);
        if ( result.result == 'done' ) {
            document.getElementById('reservelive').style.display = "none";
            document.getElementById('pppp').innerHTML = "신청 완료";
        }
        else {
            alert(result.result);
        }
    });
}