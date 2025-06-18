const grid = document.getElementById('grid');
const colorPicker = document.getElementById('colorPicker');
const saveBtn = document.getElementById('saveBtn');
const savePngBtn = document.getElementById('savePngBtn');
const clearBtn = document.getElementById('clearBtn');
const loadBtn = document.getElementById('loadBtn');

const GRID_SIZE = 64;
let cells = [];
let isDrawing = false;
let isErasing = false;

function setCellColor(cell, color) {
  if (color === 'transparent') {
    cell.style.backgroundColor = 'transparent';
    cell.style.border = '2px solid #ddd';  // 다시 회색 테두리
  } else {
    cell.style.backgroundColor = color;
    cell.style.border = 'none'; // 색을 칠하면 테두리 제거
  }
}

function handleDraw(cell, erase = false) {
  if (erase) {
    setCellColor(cell, 'transparent');
  } else {
    const selectedColor = colorPicker.value.toLowerCase();
    setCellColor(cell, selectedColor);
  }
}

function createGrid() {
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const i = row * GRID_SIZE + col;
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.index = i;

      // 외곽선
      if (row === 0) cell.classList.add('border-top');
      if (row === GRID_SIZE - 1) cell.classList.add('border-bottom');
      if (col === 0) cell.classList.add('border-left');
      if (col === GRID_SIZE - 1) cell.classList.add('border-right');

      // 마우스 클릭
      cell.addEventListener('mousedown', (e) => {
        e.preventDefault();
        isDrawing = true;
        isErasing = e.button === 2; // 우클릭이면 지우기
        handleDraw(cell, isErasing);
      });

      // 마우스 드래그
      cell.addEventListener('mouseenter', () => {
        if (isDrawing) handleDraw(cell, isErasing);
      });

      // 우클릭 메뉴 방지
      cell.addEventListener('contextmenu', (e) => e.preventDefault());

      grid.appendChild(cell);
      cells.push(cell);
    }
  }
}

document.addEventListener('mouseup', () => {
  isDrawing = false;
});

const opaqueBgCheckbox = document.getElementById('opaqueBackground');

function saveGridAsPNG() {
  console.log("Save Grid As PNG.");
  const canvas = document.createElement('canvas');
  const size = GRID_SIZE;
  const cellSize = 10;
  canvas.width = size * cellSize;
  canvas.height = size * cellSize;

  const ctx = canvas.getContext('2d');

  // ✅ 체크박스에 따라 배경 색 결정
  if (opaqueBgCheckbox.checked) {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // 투명 배경
  }

  // 셀 색상 그리기
  cells.forEach((cell, i) => {
    const color = window.getComputedStyle(cell).backgroundColor;
    if (color !== 'rgba(0, 0, 0, 0)' && color !== 'transparent') {
      const x = (i % size) * cellSize;
      const y = Math.floor(i / size) * cellSize;
      ctx.fillStyle = color;
      ctx.fillRect(x, y, cellSize, cellSize);
    }
  });

  const link = document.createElement('a');
  link.download = 'dot-art.png';
  link.href = canvas.toDataURL();
  link.click();
}

// 저장
function saveGrid() {
  const data = cells.map(cell => cell.style.backgroundColor || '');
  localStorage.setItem('dotGrid', JSON.stringify(data));
  alert('저장되었습니다!');
}

// 불러오기
function loadGrid() {
  const data = JSON.parse(localStorage.getItem('dotGrid'));
  if (data) {
    data.forEach((color, i) => {
       // 테두리 처리
       cells[i].style.backgroundColor = color;
      if (!color || color === 'transparent' || color === 'rgba(0, 0, 0, 0)') {
        cells[i].style.border = '2px solid #ddd'; // 투명하면 테두리 유지
      } else {
        cells[i].style.border = 'none'; // 색이 있으면 테두리 제거
      } 
      
      });
  }
}

// 초기화
function clearGrid() {
  cells.forEach(cell => {
    cell.style.backgroundColor = 'transparent';  
    cell.style.border = '2px solid #ddd';});
  localStorage.removeItem('dotGrid');
}


// RGB → HEX 변환
function rgbToHex(rgb) {
  if (!rgb || rgb === 'transparent') return 'transparent';
  if (!rgb.startsWith('rgb')) return rgb;
  const [r, g, b] = rgb.match(/\d+/g).map(Number);
  return (
    '#' +
    [r, g, b]
      .map(x => x.toString(16).padStart(2, '0'))
      .join('')
      .toLowerCase()
  );
}

// 초기 실행
createGrid();
loadGrid();
saveBtn.addEventListener('click', saveGrid);
savePngBtn.addEventListener('click', saveGridAsPNG);
clearBtn.addEventListener('click', clearGrid);
loadBtn.addEventListener('click', loadGrid);