var button = document.querySelector('.input-group-btn');
var website =document.querySelector("input[id='website']");
var searchString =document.querySelector("input[id='searchString']");
var para = document.querySelector('.answer');

function fetchData(){

	var bodypar = {
		'website': website.value,
		'serachstring': searchString.value
	};

	$.post("http://localhost:3000/title",{
		website: website.value,
		searchstring: searchString.value
	}, function(data, status){
		if(data==='No Data Found'){
			para.innerHTML = data;
		} else{
			var answer='';
			console.log(status);

			for (var i = data.length - 1; i >= 0; i--) {
				$("table tbody").append(`<tr><td>${data[i]}</td></tr>`);
			}
		}
	});

}

button.addEventListener('click', fetchData);