(function( $ ) {
    'use strict';
		var ang_pattern = /^[1-9]([0-9]{1,2})?([- d][0-9]{1,2}([- '][0-9]{1,2})?)?[" ]?$/;
		var num_pattern = /^([1-9][0-9]*|0)([\.,][0-9]*)?$/;

		var unit_type;
		var unit_value;

		function upd(result) {
		    $.each(result, function(i, field) {
				if (i.match(/^btn/)) {		// update button text
					$('.' + i.substr(3)).attr('value', field);
				} else if (i.match(/^plh/)) {	// update placeholder text
					$('.' + i.substr(3)).attr('placeholder', field)
				} else {					// update other html text
					$('#' + i).html(field);
				}
		    });
		}

		$(document).ready(function () {
			// get local messages
			var lang = navigator.language.substr(0,2);
			if (! lang.match(/^en/))
				$.getJSON(lang + '.json', upd);


			// Areas
			$(".area").focus(function(e){
				$(".area").css('background-color', '');
				var w = '#' + e.target.id;
				var v = $(w).val();

				unit_type = e.target.id;
				console.log("unit_type", unit_type);
				$(w).val(v);
				$(".area").val("");

				$('#convertarea').prop('disabled', false);
				$("#convertarea").css('background-color', '#ffc71b');
				$("#convertarea").css('color', '#07518c');
				$("#convertarea").css('border-color', '#ffc71b');
			});

			$(".area").keypress(function(e) {
				if (e.which == 13) {
					area_convert(unit_type);
					$('#convertarea').prop('disabled', true);
					$("#convertarea").css('background-color', '#909090');
					$("#convertarea").css('color', '#ffffff');
					$("#convertarea").css('border-color', '#909090');
				}
			});
			$("#convertarea").click(function(){
				area_convert(unit_type);
				$('#convertarea').prop('disabled', true);
				$("#convertarea").css('background-color', '#909090');
				$("#convertarea").css('color', '#ffffff');
					$("#convertarea").css('border-color', '#909090');


			});

			$("#resetarea").click(function(){
				$('#convertarea').prop('disabled', false);
				$("#convertarea").css('background-color', '#ffc71b');
				$("#convertarea").css('color', '#07518c');
				$("#convertarea").css('border-color', '#ffc71b');



			});


		});

		function area_convert(unit_type_final){
			var unit_type_selected = unit_type_final;
			var unit_type_selector = '#' + unit_type_final;
			var unit_value_selected = $(unit_type_selector).val();
			console.log("unit type selected",unit_type_selected);
			console.log("unit vale selected",unit_value_selected);
			$(".area").css('background-color', '');
			//convert imput field to square meter
			var sm, ac, yd, sf, v;
			if ($("#smeter").val().length) {
				v = $("#smeter").val().replace(',', '.');
				if (! num_pattern.test(v)) {
					$("#smeter").css('background-color', 'red');
					return;
				}
					sm = (v * 1).toFixed(5);
					ac = (v * 0.000247105).toFixed(5);
					yd = (v * 1.19599).toFixed(5);
					sf = (v * 10.7639).toFixed(5);

			} else if ($("#acre").val().length) {
				v = $("#acre").val().replace(',', '.');
				if (! num_pattern.test(v)) {
					$("#acre").css('background-color', 'red');
					return;
				}
					sm = (v * 4046.86).toFixed(5);
					ac = (v * 1).toFixed(5);
					yd = (v * 4840.0042785600007846).toFixed(5);
					sf = (v * 43560.03850704).toFixed(5);
			}  else if ($("#yard").val().length) {
				v = $("#yard").val().replace(',', '.');
				if (! num_pattern.test(v)) {
					$("#yard").css('background-color', 'red');
					return;
				}
					sm = (v / 1.0936132983377078).toFixed(5);
					ac = (v / 4840.0042785600007846).toFixed(5);
					yd = (v * 1).toFixed(5);
					sf = (v / 9.000007955999999254).toFixed(5);
			} else if ($("#sqrft").val().length) {
				v = $("#sqrft").val().replace(',', '.');
				if (! num_pattern.test(v)) {
					$("#sqrft").css('background-color', 'red');
					return;
				}
					sm = (v / 10.76391041671).toFixed(5);
					ac = (v / 43560.03850704).toFixed(5);
					yd = (v / 9.000007955999999254).toFixed(5);
					sf = (v * 1).toFixed(5);
			}
			if (! sm) return;
			// convert other fields to sq m
			$("#smeter").val(sm);
			$("#acre").val(ac);
			$("#sqrft").val(sf);
			$("#yard").val(yd);
			$("#convertarea").focus();
		}

})( jQuery );
