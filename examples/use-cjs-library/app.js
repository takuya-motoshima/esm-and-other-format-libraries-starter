import {add} from 'esm-and-other-format-libraries-starter';
document.querySelectorAll('#num1,#num2').forEach(el => 
  el.addEventListener('input', () => {
    const num1 = parseFloat(document.querySelector('#num1').value, 0) || 0;
    const num2 = parseFloat(document.querySelector('#num2').value, 0) || 0;
    document.querySelector('#result').value = add(num1, num2);
  }
));