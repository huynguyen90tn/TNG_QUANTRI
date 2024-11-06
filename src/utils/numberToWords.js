// File: src/utils/numberToWords.js
// Nhánh: main

const units = [
    "", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín", "mười",
    "mười một", "mười hai", "mười ba", "mười bốn", "mười lăm", "mười sáu",
    "mười bảy", "mười tám", "mười chín"
  ];
  
  const tens = [
    "", "", "hai mươi", "ba mươi", "bốn mươi", "năm mươi", "sáu mươi",
    "bảy mươi", "tám mươi", "chín mươi"
  ];
  
  const scales = ["", "nghìn", "triệu", "tỷ"];
  
  const readHundreds = (number) => {
    const hundred = Math.floor(number / 100);
    const remainder = number % 100;
  
    let result = "";
    
    if (hundred > 0) {
      result += units[hundred] + " trăm ";
    }
  
    if (remainder > 0) {
      if (remainder < 20) {
        result += units[remainder];
      } else {
        const ten = Math.floor(remainder / 10);
        const one = remainder % 10;
        result += tens[ten];
        if (one > 0) {
          result += " " + units[one];
        }
      }
    }
  
    return result.trim();
  };
  
  export const numberToVietnameseWords = (number) => {
    if (number === 0) return "không";
    if (number < 0) return "âm " + numberToVietnameseWords(Math.abs(number));
  
    let result = "";
    let scaleIndex = 0;
    
    while (number > 0) {
      const segment = number % 1000;
      if (segment > 0) {
        const segmentWords = readHundreds(segment);
        if (segmentWords) {
          result = segmentWords + " " + scales[scaleIndex] + " " + result;
        }
      }
      number = Math.floor(number / 1000);
      scaleIndex++;
    }
  
    // Xử lý chữ "lẻ" và "mươi"
    result = result.replace(" mươi năm", " mươi lăm");
    result = result.replace("mươi một", "mươi mốt");
  
    return result.trim();
  };