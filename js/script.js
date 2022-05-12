var expression = [], buffLocalStorage = [];

$(document).ready(function(){
	showLocalStorage();
	$('.column__item').click(function(){
		let symbol = $(this).text();
		
		if($('.input__field').hasClass('active')){
			switch(symbol){
				case "=": arifmetic(); break;
				case "^": addElem(symbol, 1); break;
				case "√": addElem(symbol, 0); break;
				case "%": addElem(symbol, 1); break;
				case "/": addElem(symbol, 1); break;
				case "*": addElem(symbol, 1); break;
				case "-": addElem(symbol, 1); break;
				case "+": addElem(symbol, 1); break;
				case "C": 
					$('.input__field').text("");
					expression = [];
					break;
				default:
					if(symbol != 'on' && symbol != 'off'){
						$('.input__field').text($('.input__field').text() + symbol);
						addElem(symbol, 0);
					} 
					break;
			}
		}

		switch(symbol){
			case "on": 
				$('.input__field').addClass('active');
				break;
			case "off":
				$('.input__field').removeClass('active');
				$('.input__field').text("");
				break;
		}
	});
	$('.calc__arrow').click(function(){
		
		$('.calc__list').toggleClass('active');
		if($('.calc__list').hasClass('active')){
			$('.calc__arrow  img').css('transform','rotate(0deg)');
			$('.calc__arrow').css('background-color','rgb(36, 212, 127)');
		}
		else{
			$('.calc__arrow  img').css('transform','rotate(180deg)');
			$('.calc__arrow').css('background-color','rgba(44, 191, 120, 0.836)');
		}
	});
});

function addElem(symbol, flag){
	if(flag){
		expression[expression.length] = symbol;
		$('.input__field').text("");
	}
	else{
		if(expression.length % 2 == 0) expression[expression.length] = symbol;
		else {
			if(symbol == "√") expression[expression.length - 1] = symbol;
			else expression[expression.length - 1] += symbol;
		}
	}
}
function arifmetic(){
	let result = check(expression[0]);
	if(expression.length == 1){
		result = result.toString();
		if(result.includes('.'))
			result = Number(result).toFixed(6);
		expression[0] = result.toString();
	}
	else{
		let a, b;
		for(let i = 0; i < expression.length; i++){
			if(i % 2 != 0){
				a = result;
				b = check(expression[i + 1]);
				switch(expression[i]){
					case "^": result = Math.pow(Number(result), b); break;
					case "%": result = Number(result) / 100 * b; break;
					case "/": result = Number(result) / Number(b); break;
					case "*": result = Number(result) * Number(b); break;
					case "-": result = Number(result) - Number(b); break;
					case "+": result = Number(result) + Number(b); break;
					default: break;
				}
				result = result.toString();
				if(result.includes('.')) result = Number(result).toFixed(6);
				concatenation(a, expression[i], b, result);					
			}
		}
		expression = [];
		expression[0] = result;
	}
	$('.input__field').text(result);
}
function concatenation(a, symbol, b, c){
	let result = "" + a + " " + symbol + " " + b + " = " + c;
	$('.list__body').append('<li class="list__link">'+ result +'</li>');
	pushInLocalStorage(result);
	if(($('.list__body').find('li')).length != 0)
			$('.calc__list').css('display','block');
}
function check(number){
	number.toString();
	if(number.includes("√")){
		let count = number.slice(1);
		let result = Math.sqrt(count);
		result = result.toString();
		if(result.includes('.')) result = Number(result).toFixed(6);		
		$('.list__body').append('<li class="list__link">'+ '√(' + count + ')' + ' = ' + result +'</li>');
		pushInLocalStorage('√(' + count + ')' + ' = ' + result);		
		return result;
	}
	return number;
}
function pushInLocalStorage(item){
	if(buffLocalStorage.length == 100){
		balancingLocalStorage();
		buffLocalStorage[buffLocalStorage.length - 1] = item;
		localStorage.setItem('list', buffLocalStorage);
	}
	else{
		buffLocalStorage[buffLocalStorage.length] = item;
		localStorage.setItem('list', buffLocalStorage);
	}
}
function balancingLocalStorage(){
	for(let i = 0; i < buffLocalStorage.length; i++){
		if(i != buffLocalStorage.length - 1)
			buffLocalStorage[i] = buffLocalStorage[i + 1];
	}
}
function showLocalStorage(){
	//delete localStorage.list;
	if(localStorage.getItem('list')){
		buffLocalStorage = (localStorage.getItem('list')).split(",");
		for(let i = 0; i < buffLocalStorage.length; i++)
			$('.list__body').append('<li class="list__link">'+ buffLocalStorage[i] +'</li>');
	}
	if(($('.list__body').find('li')).length == 0)
		$('.calc__list').css('display','none');
	else
		$('.calc__list').css('display','block');
}
