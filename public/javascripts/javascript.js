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

    if ( boardtype == 'free' ) {
        xhr.addEventListener('load', function() {
            var result = JSON.parse(xhr.responseText);
            var btn = document.getElementById('recommendbtn');
            btn.innerHTML = '추천 ' + result.recommend;
        });
    }
    else if ( boardtype == 'music' ) {
        xhr.addEventListener('load', function() {
            var result = JSON.parse(xhr.responseText);
            var gradeSpan = document.getElementById('gradeSpan');
            gradeSpan.innerHTML = '평점 ' + result.grade + ' by ' + result.people;
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
