function info(userid) {
    console.log(userid);
    window.open("./info?userid="+userid, "INFO", "width=500, height=600, left=300, top=100, scrollbars=yes, toolbars=no, location=no");
}

function confirmRemove() {
    return confirm("정말 삭제하시겠습니까?");
}
