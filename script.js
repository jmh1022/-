
let history = JSON.parse(localStorage.getItem('fuelHistory')) || [];

function calculateEfficiency() {
  const distance = parseFloat(document.getElementById('distance').value);
  const fuel = parseFloat(document.getElementById('fuel').value);
  
  if (!distance || !fuel || distance <= 0 || fuel <= 0) {
    alert('올바른 주행거리와 연료량을 입력해주세요.');
    return;
  }
  
  // km/L 계산
  const kmPerLiter = distance / fuel;
  
  // L/100km 계산
  const literPer100km = (fuel / distance) * 100;
  
  // 연비 등급 결정
  const grade = getEfficiencyGrade(kmPerLiter);
  
  // 결과 표시
  document.getElementById('kmPerLiter').textContent = kmPerLiter.toFixed(2);
  document.getElementById('literPer100km').textContent = literPer100km.toFixed(2);
  
  const gradeElement = document.getElementById('grade');
  gradeElement.textContent = grade.text;
  gradeElement.className = `value grade ${grade.class}`;
  
  // 기록에 추가
  addToHistory(distance, fuel, kmPerLiter, literPer100km, grade.text);
  
  // 입력 필드 초기화
  document.getElementById('distance').value = '';
  document.getElementById('fuel').value = '';
}

function getEfficiencyGrade(kmPerLiter) {
  if (kmPerLiter >= 16.0) {
    return { text: '1등급', class: 'grade1' };
  } else if (kmPerLiter >= 13.8) {
    return { text: '2등급', class: 'grade2' };
  } else if (kmPerLiter >= 11.6) {
    return { text: '3등급', class: 'grade3' };
  } else if (kmPerLiter >= 9.4) {
    return { text: '4등급', class: 'grade4' };
  } else {
    return { text: '5등급', class: 'grade5' };
  }
}

function addToHistory(distance, fuel, kmPerLiter, literPer100km, grade) {
  const record = {
    date: new Date().toLocaleString('ko-KR'),
    distance: distance,
    fuel: fuel,
    kmPerLiter: kmPerLiter.toFixed(2),
    literPer100km: literPer100km.toFixed(2),
    grade: grade
  };
  
  history.unshift(record);
  
  // 최대 10개 기록만 유지
  if (history.length > 10) {
    history = history.slice(0, 10);
  }
  
  localStorage.setItem('fuelHistory', JSON.stringify(history));
  displayHistory();
}

function displayHistory() {
  const historyList = document.getElementById('historyList');
  historyList.innerHTML = '';
  
  if (history.length === 0) {
    historyList.innerHTML = '<li style="text-align: center; color: #666;">계산 기록이 없습니다.</li>';
    return;
  }
  
  history.forEach(record => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div style="font-weight: bold; margin-bottom: 5px;">${record.date}</div>
      <div>주행거리: ${record.distance}km | 연료: ${record.fuel}L</div>
      <div>연비: ${record.kmPerLiter}km/L (${record.literPer100km}L/100km) | 등급: ${record.grade}</div>
    `;
    historyList.appendChild(li);
  });
}

function clearHistory() {
  if (confirm('모든 계산 기록을 삭제하시겠습니까?')) {
    history = [];
    localStorage.removeItem('fuelHistory');
    displayHistory();
  }
}

// 페이지 로드 시 기록 표시
document.addEventListener('DOMContentLoaded', function() {
  displayHistory();
  
  // 엔터 키로 계산 실행
  document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      calculateEfficiency();
    }
  });
});
