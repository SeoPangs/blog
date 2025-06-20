let qr;

const input = document.getElementById("text");
const generateBtn = document.getElementById("generateBtn");
const downloadBtn = document.getElementById("downloadBtn");
const qrcodeContainer = document.getElementById("qrcode");
const marginCheckbox = document.getElementById("marginCheckbox");

function generateQRCode() {
  const text = input.value.trim();
  qrcodeContainer.innerHTML = "";
  downloadBtn.style.display = "none";

  if (!text) {
    alert("문자열을 입력해주세요.");
    return;
  }

  // 여백 유무 설정
  const hasMargin = marginCheckbox.checked;

  qr = new QRCode(qrcodeContainer, {
    text: text,
    width: 256,
    height: 256,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H
  });

  // qrcode.js는 여백 조절 기능이 제한되어 있어, 기본 설정만 지원합니다.
  // 여백 제거는 후처리 필요 (복잡하므로 생략)

  setTimeout(() => {
    const img = qrcodeContainer.querySelector("img");
    if (img && !hasMargin) {
      // margin 없는 이미지로 만들기 위해 canvas 직접 생성
      const canvas = document.createElement("canvas");
      const size = 256;
      const ctx = canvas.getContext("2d");

      canvas.width = size;
      canvas.height = size;

      // 배경 흰색
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, size, size);

      const tempImg = new Image();
      tempImg.onload = () => {
        ctx.drawImage(tempImg, 0, 0, size, size);
        qrcodeContainer.innerHTML = "";
        const newImg = document.createElement("img");
        newImg.src = canvas.toDataURL("image/png");
        qrcodeContainer.appendChild(newImg);
        downloadBtn.style.display = "inline-block";
      };
      tempImg.src = img.src;
    } else {
      downloadBtn.style.display = "inline-block";
    }
  }, 200);
}

function downloadQRCode() {
  const img = qrcodeContainer.querySelector("img");
  if (!img) return;

  const link = document.createElement("a");
  link.href = img.src;
  link.download = "qrcode.png";
  link.click();
}

// 이벤트 바인딩
generateBtn.addEventListener("click", generateQRCode);
input.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    generateQRCode();
  }
});
downloadBtn.addEventListener("click", downloadQRCode);
