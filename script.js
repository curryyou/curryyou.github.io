// ### 태크 취득
const btn_divide = document.querySelector('#btn_divide');
const btn_diff_plus = document.querySelector('#btn_diff_plus');
const btn_diff_minus = document.querySelector('#btn_diff_minus');
const info = document.querySelector('main>#section_title a');
const span_diff_val = document.querySelector('#span_diff_val');

// diff 변수 선언 및 초기화(디폴트 1)
let diff = 1;

// ### 타이틀 부분 (i) 이벤트 처리
info.onclick = function(e){
    e.preventDefault();
    alert('총금액을 랜덤한 숫자로 나누는 계산기입니다');
}


// ### 계산하기 버튼 클릭 이벤트 처리
btn_divide.onclick = function(e){

    // 0. input 입력값 취득
    const total = getTotal();
    const count = getCount();

    // 1. 입력값 유효성 체크
    if (!(total && count)){
        // 입력값이 없는 경우 체크
        alert('총 금액, 총 회차를 모두 숫자로 입력해주세요.');
        return;
    }else if(total <= count){
        // divider가 더 큰지 체크
        alert('총 회차는 총금액을 초과할 수 없습니다.');
        return;
    }else if(total <= 0 || count <= 0){
        // 음수 체크
        alert('마이너스 값은 입력할 수 없습니다.');
        return;
    }

    // 2.  #section_result 노출 처리
    const sectionResult = document.querySelector('#section_result');
    displayBlock(sectionResult);
    
    // 2. 테이블 초기화(이전 계산결과 행 삭제)
    const table = document.querySelector('table')
    initTable(table);
    
    // 3. diff 설정(디폴트 1)
    diff = 1;
    
    // 4. 마이너스 버튼 초기화(비활성화)
    activateArrow(btn_diff_minus, false);

    // 5. 플러스 버튼 초기화(활성/비활성화)
    if(checkPlus(total, count, diff) === -1){
        activateArrow(btn_diff_plus, false);// 격차를 더 주는게 불가할 경우, 비활성화.
    }else{
        activateArrow(btn_diff_plus, true); // 격차를 더 줄수 있는 경우, 활성화
    }

    // 6. 계산 수행
    const results = divideTotal(total, count, diff);
    
    // 7. 행 추가: 계산 결과를 배열로 받아서, 차례로 행 추가
    results.forEach((value, index, array)=>{
        addRow(table, index+1, value);
    });
    
}

btn_diff_plus.onclick = function(e){
    
    e.preventDefault();

    console.log('plus before diff', diff);

    // 총금액, 총회차 값 취득
    const total = getTotal();
    const count = getCount();
    
    const check = checkPlus(total, count, diff);
    if(check === -1){ // 마지막 플러스 한도 초과시, 즉시 종료(무반응 처리)
        return;
    }else if(check === 0){ // 마지막 플러스 한도인 경우, diff 증가 시키고, 버튼 비활성화 처리
        diff++
        activateArrow(this, false);
    }else{ // 플러스 한도가 남은 경우, diff 증가 처리
        diff++
    }

    // diff가 증가하여, 2 이상이 되면, 마이너스 버튼 활성화 처리
    if(diff >= 2 ){
        activateArrow(btn_diff_minus, true);
    }

    console.log('plus after diff', diff);

    // 격차 상태 표시 갱신
    span_diff_val.textContent = diff;

    // 테이블 초기화 및 격차 적용 계산하여 테이블 구성
    const table = document.querySelector('table');
    initTable(table);
    const results = divideTotal(total, count, diff);
    results.forEach((value, index, array)=>{
        addRow(table, index+1, value);
    });
    
}

btn_diff_minus.onclick = function(e){
    e.preventDefault();

    // 총금액, 총회차 값 취득
    const total = getTotal();
    const count = getCount();

    console.log('minus before diff', diff);
    
    
    if(diff === 1){ // diff가 1이면 종료(diff 변경X, 1이 마지막)
        return;
    }else if (diff === 2){ // diff 가 2이면, 하나 줄이고, 버튼 비활성화 처리
        diff--;
        activateArrow(btn_diff_minus, false);
    }else{ // diff가 3이상이면, diff만 하나 감소 처리
        diff--;
    }

    // 플러스 한도가 생기면, 플러스 버튼 활성화 처리
    if (checkPlus(total, count, diff) !== -1){
        activateArrow(btn_diff_plus, true);
    }
    
    console.log('minus after diff', diff);

    span_diff_val.textContent = diff;

    // 테이블 초기화 및 격차 적용 계산하여 테이블 구성
    const table = document.querySelector('table');
    initTable(table);
    const results = divideTotal(total, count, diff);
    results.forEach((value, index, array)=>{
        addRow(table, index+1, value);
    });
    
}

// 플러스/마이너스 버튼 활성/비활성화 처리
function activateArrow(btn, toggle=true){
    if(toggle){ // 활성화
        btn.firstElementChild.style.color = '#0096FF';
        btn.setAttribute('href', "#");
    }else{ // 비활성화
        btn.firstElementChild.style.color = 'gray';
        btn.removeAttribute('href');
    }
}

// 플러스 한도 체크
function checkPlus(total, count, diff){
    const avg = Math.round(total/count);
    const len = String(avg).length;
    const limit = len - diff;
    if (limit > 2){ 
        return 1; // 추가 플러스 가능
    }else if(limit === 2){ 
        return 0; // 마지막 플러스
    }else{
        return -1; // 플러스 불가
    }
}

// func: 총 금액 취득
function getTotal(){
    const total = document.querySelector('#input_total');
    const total_val = total.value;
    
    if(total_val === ""){
        console.log('총 금액 미입력.');
        return;
    }else{
        return parseInt(total_val);
    }
}

// func: 총 회차 취득
function getCount(){
    const total = document.querySelector('#input_count');
    const total_count = total.value;
    
    if(total_count === ""){
        console.log('총 회차 미입력.');
        return;
    }else{
        return Number(total_count);
    }
}


// func: 노출 처리 함수
function displayBlock(block){
    block.style.display = 'block';
    return block;
}

// func: 테이블 초기화 함수
function initTable(table){
    // 제목 행만 남기고, 모두 삭제
    table.firstElementChild.innerHTML = "<tr><th>회차</th><th>금액</th></tr>";
}

// func: 테이블 행 추가 함수
function addRow(table, count, result){
    const row = table.insertRow();
    const cell_count = row.insertCell(0);
    const cell_result = row.insertCell(1);
    cell_count.textContent = count;
    cell_result.textContent = result;
    
    return row;
}

// func: 계산 함수
function divideTotal(total, count, diff){
    // # 배열 생성: 회차별 계산 결과
    const results = [];

    // 1. 평균 계산(소수점 반올림)
    const avg = Math.round(total/count);

    // 2. diff(금액간 격차)를 10의 n승으로 변환
    diff_pow = 10**diff ;

    // 3. 회차별 랜덤 금액 더하기 (마지막 회차는 전체금액 - 누적합 으로 계산)
    for(let i = 0; i < count; i++){

        // 3-1. 마지막 회차의 금액은, total-누적합으로 계산
        if(i === (count-1)){
            const accSum = results.reduce((pv, cv)=>{
                return pv + cv;
            }, 0);
            results.push(total - accSum);
            break; // 계산 반복문 전체 종료
        }
        
        // 3-2. 평균에 랜덤 수치를 더했다가 뺐다가 반복
        // diff 값으로 격차 크기를 조정. 0.5를 곱해줘야 음수 값이 안나옴
        // diff값은 total자릿수 -2 만큼이 최대치(클수록 격차가 커짐)
        if(i % 2 === 0){
            results.push(avg + Math.round(Math.random() * diff_pow * 0.5))
        }else{
            results.push(avg - Math.round(Math.random() * diff_pow * 0.5))
        }

    }
    
    // # 최종 결과 배열 반환
    return results;
}
