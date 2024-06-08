$(document).ready(function () {
	str = 'S -> '
	str_cheked = ''
	step = 2
	hurufk = false
	hurufb = false
	autospace = false
	key = false
	key_checked = false
	textinlinelength = 0
	ltextinlinelength = []
	lines = 1

	arr = []
	arrb = []
	error = ''

	$('#buttonstep1').click(function () {
		$('#step1.activestep').removeClass('activestep')
		$('#step2').addClass('activestep')
	})

	$('#buttonstep2').click(function () {
		last = str.charCodeAt(str.length - 1)
		last2 = str.charCodeAt(str.length - 2)
		if (textinlinelength > 0 && !(last > 64 && last < 91 && last2 == 32)) {
			$('#step2.activestep').removeClass('activestep')
			$('#step3').addClass('activestep')
		} else {
			alert('Your Chomsky normal form is incomplete')
		}
	})

	$('#buttonstep31').click(function () {
		$('#step3.activestep').removeClass('activestep')
		$('#step2').addClass('activestep')
	})

	$('#buttonstep32').click(function () {
		if ($('.inputsb').val().length > 0) {
			$('#step3.activestep').removeClass('activestep')
			$('#step4').addClass('activestep')
			results()
		} else {
			alert('Please enter something')
		}
	})

	$('#buttonstep4').click(function () {
		$('#step4.activestep').removeClass('activestep')
		$('#step3').addClass('activestep')
	})

	$('#step2').height($(window).height() - 10)
	$('#step3').height($(window).height() - 10)
	$('.content').height($(window).height() - 110)

	$('.inputs').val(str)
	$('.inputsb').val(str_cheked)

	$('.inputs').keypress(function (e) {
		key = e.which
	})

	$('.inputsb').keypress(function (e) {
		key_checked = e.which
	})

	$('.inputs').keyup(function () {
		texts = $(this).val()
		if (key) {
			$(this).val('')
		}

		if (key == 8) {
			if (texts.length < 5) {
				str = 'S -> '
				$(this).val(str)
				step = 2
				numbers = 0
				autospace = hurufk = hurufb = false
			} else if (textinlinelength == 0 && lines > 1) {
				if (step == 2) {
					step = 1
					str = texts.substr(0, texts.length - 4)
					$(this).val(str)
					autospace = hurufk = hurufb = false
				} else {
					step = 2
					textinlinelength = ltextinlinelength.pop()
					str = texts.substr(0, texts.length) + ' | '
					autospace = true
					hurufk = hurufb = false
					$(this).val(str)
				}
			} else {
				if (texts[texts.length - 1] == '|' && texts.length > 5) str = texts.substr(0, texts.length - 2)
				else {
					str = texts.substr(0, texts.length)
					textinlinelength--
				}

				$(this).val(str)

				last = str.charCodeAt(str.length - 1)
				last2 = str.charCodeAt(str.length - 2)

				if (last > 96 && last < 123 && last2 == 32) {
					hurufk = true
					hurufb = false
					autospace = false
				} else if (last > 64 && last < 91 && last2 == 32) {
					hurufk = false
					hurufb = true
					autospace = false
				} else if ((last > 96 && last < 123 && last2 > 64 && last2 < 91) || (last2 > 96 && last2 < 123 && last > 64 && last < 91)) {
					hurufk = false
					hurufb = true
					autospace = false
				} else if (last > 64 && last < 91 && last2 > 64 && last2 < 91) {
					hurufk = false
					hurufb = true
					autospace = false
				} else {
					autospace = true
					hurufk = false
					hurufb = false
				}
			}
		} else if (key == 32) {
			if (step == 2 && (hurufk || hurufb)) {
				str = str + ' | '
				autospace = true
				hurufb = hurufk = false
			}
			$(this).val(str)
		} else if (key == 13) {
			last = str.charCodeAt(str.length - 1)
			last2 = str.charCodeAt(str.length - 2)
			if (step == 2 && (!hurufb || (hurufb && last2 > 64 && last2 < 91))) {
				if (str[str.length - 2] == '|' && str[str.length - 1] == ' ') {
					str = str.substr(0, str.length - 3)
				}
				if (textinlinelength > 0) {
					str += '\n'
				}
				hurufb = false
				hurufk = false
				autospace = false
				ltextinlinelength.push(textinlinelength)
				textinlinelength = 0
				step = 1
				lines++
			}
			$(this).val(str)
		} else if (key) {
			if (step == 2) {
				if (key > 96 && key < 123 && !hurufb) {
					if (hurufk) {
						str += ' | ' + String.fromCharCode(key)
						hurufk = true
					} else {
						autospace = false
						hurufk = true
						str += String.fromCharCode(key)
					}
					textinlinelength++
				}

				if (key > 64 && key < 91) {
					if (hurufb) {
						str += String.fromCharCode(key) + ' | '
						hurufb = false
					} else if (hurufk) {
						str += ' | ' + String.fromCharCode(key)
						hurufb = true
					} else {
						str += String.fromCharCode(key)
						hurufb = true
					}
					textinlinelength++
					hurufk = false
				}
			} else if (key > 64 && key < 91) {
				str += String.fromCharCode(key) + ' -> '
				step = 2
			}

			$(this).val(str)
			key = false
		}
	})

	$('.inputsb').keyup(function () {
		texts = $(this).val()
		if (key_checked) {
			$(this).val('')
		}

		if (key_checked == 8 && texts.length > -1) {
			str_cheked = texts.substr(0, texts.length)
		}

		if (key_checked > 96 && key_checked < 123) {
			str_cheked += String.fromCharCode(key_checked)
		}
		$(this).val(str_cheked)
	})

	function results() {
		error = ''
		test = str.split('\n')

		for (i = 0; i < test.length; i++) {
			strs = test[i]
			if (strs[strs.length - 1] == ' ') strs = strs.substr(0, strs.length - 2)
			label = strs.substr(0, 1)
			strs = strs.substr(5, strs.length + 1)
			arr[i] = strs.split(' | ')
			arrb[i] = label
		}

		//tables
		tables = str_cheked.split('')
		tablesl = tables.length
		$('.tables').empty()

		for (i = 0; i < tablesl; i++) {
			addstr = ''
			for (j = 0; j < tablesl; j++) {
				addstr += "<td index='" + Math.abs(j - tablesl) + '.' + Math.abs(i + j - 2 * tablesl + 1) + "'"
				if (i + j + 1 < tablesl) addstr += " class='hidden'"
				addstr += '></td>'
			}
			$('.tables').append('<tr>' + addstr + '</tr>')
		}

		for (i = 0; i < tablesl; i++) {
			str_test = tables[i]
			found = false
			for (j = 0; j < arr.length; j++) {
				found_in = false
				for (k = 0; k < arr[j].length; k++) {
					element = $('td[index="' + (i + 1) + '.' + (i + 1) + '"]')
					if (arr[j][k] == str_test && !found_in) {
						found = found_in = true
						txt = element.text()
						if (txt == '') element.text(arrb[j])
						else element.text(txt + ',' + arrb[j])
					}
				}
			}
			if (!found) {
				error += 'The ' + str_test + " does not exist in Chomsky's normal form\n"
			}
		}

		if (error != '') {
			alert(error)
		} else {
			for (i = 1; i < tablesl; i++) {
				for (j = 1; j < tablesl; j++) {
					if (j + i <= tablesl) {
						parent = j
						parent_b = j + i

						state = parent + '.' + parent_b

						for (z = 0; z < parent_b - parent; z++) {
							p1 = parent + '.' + (parent + z)
							p2 = parent + z + 1 + '.' + parent_b

							s1 = $('td[index="' + p1 + '"]')
								.text()
								.split(',')
							s2 = $('td[index="' + p2 + '"]')
								.text()
								.split(',')

							for (l = 0; l < s1.length; l++) {
								for (m = 0; m < s2.length; m++) {
									check = s1[l] + s2[m]
									for (n = 0; n < arr.length; n++) {
										founds = false
										for (s = 0; s < arr[n].length; s++) {
											if (arr[n][s] == check && !founds) {
												founds = true
												element = $('td[index="' + state + '"]')
												txt = element.text()
												if (txt.indexOf(arrb[n]) < 0) {
													if (txt == '') element.text(arrb[n])
													else element.text(txt + ',' + arrb[n])
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}

			check_end = $('td[index="1.' + tablesl + '"]')
				.text()
				.toString()

			if (check_end.indexOf('S') > -1) {
				$('.message').text('The ' + str_cheked + ' string applies to the grammar in question')
				$('.message').addClass('acp')
			} else {
				$('.message').text('The ' + str_checked + ' string does not apply')
				$('.message').removeClass('acp')
			}

			$('td').each(function () {
				if ($(this).text() == '') {
					$(this).text('{}')
				}
			})
		}
	}
})
