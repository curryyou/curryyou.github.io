window.onload = function(){
    alert('js 연결 테스트');
    const div_first = document.querySelector('#div_first');
    div_first.onclick = function(event){
        alert(event.currentTarget + '이 클릭 되었습니다.');
    }
    const div_second = document.querySelector('#div_second');
    div_second.onclick = function(event){
        alert(event.currentTarget + '이 클릭 되었습니다.');
    }
}