function info(userid) {
    console.log(userid);
    window.open("./info?userid="+userid, "INFO", "width=500, height=600, left=300, top=100, scrollbars=yes, toolbars=no, location=no");
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
