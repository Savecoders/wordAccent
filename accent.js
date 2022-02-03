// Objeto con metodo que se utilizará globalmente
const acentuacion = (numeroSilaba, tonica) => {
	const DefaultAcentacion = 'Sobresdrújula';
	const ACENTUACION = {
		0: 'Aguda',
		1: 'Grave',
		2: 'Esdrujula',
	};
	return ACENTUACION[numeroSilaba - tonica] || DefaultAcentacion;
};
//Vocales Fuertes
const VocalFuerteConAscento = [
	'a',
	'á',
	'A',
	'Á',
	'à',
	'À',
	'e',
	'é',
	'E',
	'É',
	'è',
	'È',
	'í',
	'Í',
	'ì',
	'Ì',
	'o',
	'ó',
	'O',
	'Ó',
	'ò',
	'Ò',
	'ú',
	'Ú',
	'ù',
	'Ù',
];
//vocales debiles y fuertes ascentuadas
const esVocalAbiertaAsc = (vocal) => {
	switch (vocal) {
		case 'á':
		case 'Á':
		case 'à':
		case 'À':
		case 'é':
		case 'É':
		case 'è':
		case 'È':
		case 'ó':
		case 'Ó':
		case 'ò':
		case 'Ò':
			return true;
	}
	return false;
};
const esVocalAbierta = (vocal) => {
	switch (vocal) {
		case 'a':
		case 'A':
		case 'e':
		case 'E':
		case 'o':
		case 'O':
			return true;
	}
	return false;
};
const esVocalDebilAsc = (vocal) => {
	switch (vocal) {
		case 'í':
		case 'Í':
		case 'ì':
		case 'Ì':
		case 'ú':
		case 'Ú':
		case 'ù':
		case 'Ù':
		case 'ü':
		case 'Ü':
			return true;
	}
	return false;
};
const esVocalDebil = (vocal) => {
	switch (vocal) {
		case 'i':
		case 'I':
		case 'u':
		case 'U':
		case 'ü':
		case 'Ü':
			return true;
	}
	return false;
};
//define si es consonante
const esConsonante = (test) => {
	const NO_CONSONANTE = ['i', 'I', 'u', 'U', 'ü', 'Ü'];
	if (!VocalFuerteConAscento.includes(test)) {
		if (NO_CONSONANTE.includes(test)) {
			return false;
		}
		return true;
	}
	return false;
};
//encontro silaba tonica
let [encontroTonica, tonica, numeroSilaba] = [undefined, undefined, undefined]; // (bool)   Indica si se ha encontrado la silaba tónica

const getAccent = (palabra) => {
	// Variable que almacena silaba y la pocision de la silaba
	let silabaAux;
	let silabas = [];
	encontroTonica = false;
	tonica = 0;
	numeroSilaba = 0;

	// Se recorre la palabra buscando las sílabas
	for (let actPos = 0; actPos < palabra.length; ) {
		numeroSilaba++;
		silabaAux = {};
		silabaAux.inicioPosicion = actPos;

		// Las sílabas constan de tres partes: ataque, núcleo y coda
		actPos = ataque(palabra, actPos);
		actPos = nucleo(palabra, actPos);
		actPos = coda(palabra, actPos);

		// Obtiene y silaba de la palabra
		silabaAux.silaba = palabra.substring(silabaAux.inicioPosicion, actPos);

		// Guarda silaba de la palabra
		silabas.push(silabaAux);

		if (encontroTonica && tonica === 0) tonica = numeroSilaba; // Marca la silaba tónica
	}

	// Si no se ha encontrado la sílaba tónica (no hay tilde), se determina en base a
	// las reglas de acentuación
	if (!encontroTonica) {
		if (numeroSilaba < 2) {
			tonica = numeroSilaba; // Monosílabos
		} else {
			// Polisílabos

			let letraFinal = palabra[palabra.length - 1];
			let letraAnterior = palabra[palabra.length - 2];

			if (
				!esConsonante(letraFinal) ||
				letraFinal === 'y' ||
				letraFinal === 'n' ||
				(letraFinal === 's' && !esConsonante(letraAnterior))
			) {
				tonica = numeroSilaba - 1; // Palabra llana
			} else {
				tonica = numeroSilaba; // Palabra aguda
			}
		}
	}
	return acentuacion(numeroSilaba, tonica);
};

const ataque = (palabra, posicion) => {
	// Se considera que todas las consonantes iniciales forman parte del ataque
	let ultimaConsonante = 'a';

	while (
		posicion < palabra.length &&
		esConsonante(palabra[posicion]) &&
		palabra[posicion] !== 'y'
	) {
		ultimaConsonante = palabra[posicion];
		posicion++;
	}

	// (q | g) + u (ejemplo: queso, gueto)
	if (posicion < palabra.length - 1)
		if (palabra[posicion] === 'u') {
			if (ultimaConsonante === 'q') posicion++;
			else if (ultimaConsonante === 'g') {
				var letra = palabra[posicion + 1];
				if (letra === 'e' || letra === 'é' || letra === 'i' || letra === 'í') posicion++;
			}
		} else {
			// La u con diéresis se añade a la consonante
			if (palabra[posicion] === 'ü' || palabra[posicion] === 'Ü')
				if (ultimaConsonante === 'g') posicion++;
		}

	return posicion;
};

const nucleo = (palabra, posicion) => {
	// Sirve para saber el tipo de vocal anterior cuando hay dos seguidas
	let anterior = 0;
	let esVocal;

	// 0 = fuerte
	// 1 = débil acentuada
	// 2 = débil

	if (posicion >= palabra.length) return posicion; // ¡¿No tiene núcleo?!

	// Se salta una 'y' al principio del núcleo, considerándola consonante
	if (palabra[posicion] === 'y') posicion++;

	// Primera vocal
	if (posicion < palabra.length) {
		esVocal = palabra[posicion];
		if (esVocalAbiertaAsc(esVocal)) {
			encontroTonica = true;
			anterior = 0;
			posicion++;
		} else if (esVocalAbierta(esVocal)) {
			anterior = 0;
			posicion++;
		} else if (esVocalDebilAsc(esVocal)) {
			anterior = 1;
			posicion++;
			encontroTonica = true;
			return posicion;
		} else if (esVocalDebil(esVocal)) {
			anterior = 2;
			posicion++;
		}
	}

	// 'h' intercalada en el núcleo, no condiciona diptongos o hiatos
	let hache = false;
	if (posicion < palabra.length) {
		if (palabra[posicion] === 'h') {
			posicion++;
			hache = true;
		}
	}

	// Segunda vocal
	if (posicion < palabra.length) {
		esVocal = palabra[posicion];
		if (esVocalAbiertaAsc(esVocal)) {
			if (anterior != 0) {
				encontroTonica = true;
			}
			if (anterior === 0) {
				// Dos vocales fuertes no forman silaba
				if (hache) posicion--;
				return posicion;
			} else {
				posicion++;
			}
		} else if (esVocalAbierta(esVocal)) {
			if (anterior === 0) {
				// Dos vocales fuertes no forman silaba
				if (hache) posicion--;
				return posicion;
			} else {
				posicion++;
			}
		} else if (esVocalDebilAsc(esVocal)) {
			silaba.letraTildada = posicion;

			if (anterior != 0) {
				// Se forma diptongo
				encontroTonica = true;
				posicion++;
			} else if (hache) posicion--;

			return posicion;
		} else if (esVocalDebil(esVocal)) {
			if (posicion < palabra.length - 1) {
				// ¿Hay tercera vocal?
				let siguiente = palabra[posicion + 1];
				if (!esConsonante(siguiente)) {
					let letraAnterior = palabra[posicion - 1];
					if (letraAnterior === 'h') posicion--;
					return posicion;
				}
			}
		}
	}

	// ¿tercera vocal?
	if (posicion < palabra.length) {
		esVocal = palabra[posicion];
		if (esVocal === 'i' || esVocal === 'u') {
			// Vocal débil
			posicion++;
			return posicion; // Es un triptongo
		}
	}

	return posicion;
};

const coda = (palabra, posicion) => {
	if (posicion >= palabra.length || !esConsonante(palabra[posicion])) return posicion;
	// No hay coda
	else {
		if (posicion === palabra.length - 1) {
			// Final de palabra
			posicion++;
			return posicion;
		}

		// Si sólo hay una consonante entre vocales, pertenece a la siguiente silaba
		if (!esConsonante(palabra[posicion + 1])) return posicion;

		let ConsonanteActual = palabra[posicion];
		let ConsonanteCurr = palabra[posicion + 1];

		// ¿Existe posibilidad de una tercera consonante consecutina?
		if (posicion < palabra.length - 2) {
			let ConsonanteLast = palabra[posicion + 2];

			if (!esConsonante(ConsonanteLast)) {
				// No hay tercera consonante
				// Los grupos ll, lh, ph, ch y rr comienzan silaba

				if (ConsonanteActual === 'l' && ConsonanteCurr === 'l') return posicion;
				if (ConsonanteActual === 'c' && ConsonanteCurr === 'h') return posicion;
				if (ConsonanteActual === 'r' && ConsonanteCurr === 'r') return posicion;

				///////// grupos nh, sh, rh, hl son ajenos al español(DPD)
				if (ConsonanteActual != 's' && ConsonanteActual != 'r' && ConsonanteCurr === 'h')
					return posicion;

				// Si la y está precedida por s, l, r, n o c (consonantes alveolares),
				// una nueva silaba empieza en la consonante previa, si no, empieza en la y
				if (ConsonanteCurr === 'y') {
					if (
						ConsonanteActual === 's' ||
						ConsonanteActual === 'l' ||
						ConsonanteActual === 'r' ||
						ConsonanteActual === 'n' ||
						ConsonanteActual === 'c'
					)
						return posicion;

					posicion++;
					return posicion;
				}

				// gkbvpft + l
				if (
					(ConsonanteActual === 'b' ||
						ConsonanteActual === 'v' ||
						ConsonanteActual === 'c' ||
						ConsonanteActual === 'k' ||
						ConsonanteActual === 'f' ||
						ConsonanteActual === 'g' ||
						ConsonanteActual === 'p' ||
						ConsonanteActual === 't') &&
					ConsonanteCurr === 'l'
				) {
					return posicion;
				}

				// gkdtbvpf + r

				if (
					(ConsonanteActual === 'b' ||
						ConsonanteActual === 'v' ||
						ConsonanteActual === 'c' ||
						ConsonanteActual === 'd' ||
						ConsonanteActual === 'k' ||
						ConsonanteActual === 'f' ||
						ConsonanteActual === 'g' ||
						ConsonanteActual === 'p' ||
						ConsonanteActual === 't') &&
					ConsonanteCurr === 'r'
				) {
					return posicion;
				}

				posicion++;
				return posicion;
			} else {
				// Hay tercera consonante
				if (posicion + 3 === palabra.length) {
					// Tres consonantes al final ¿palabras extranjeras?
					if (ConsonanteCurr === 'y') {
						// 'y' funciona como vocal
						if (
							ConsonanteActual === 's' ||
							ConsonanteActual === 'l' ||
							ConsonanteActual === 'r' ||
							ConsonanteActual === 'n' ||
							ConsonanteActual === 'c'
						)
							return posicion;
					}

					if (ConsonanteLast === 'y') {
						// 'y' final funciona como vocal con c2
						posicion++;
					} else {
						// Tres consonantes al final ¿palabras extranjeras?
						posicion += 3;
					}
					return posicion;
				}

				if (ConsonanteCurr === 'y') {
					// 'y' funciona como vocal
					if (
						ConsonanteActual === 's' ||
						ConsonanteActual === 'l' ||
						ConsonanteActual === 'r' ||
						ConsonanteActual === 'n' ||
						ConsonanteActual === 'c'
					)
						return posicion;

					posicion++;
					return posicion;
				}

				// Los grupos pt, ct, cn, ps, mn, gn, ft, pn, cz, tz, ts comienzan silaba (Bezos)

				if (
					(ConsonanteCurr === 'p' && ConsonanteLast === 't') ||
					(ConsonanteCurr === 'c' && ConsonanteLast === 't') ||
					(ConsonanteCurr === 'c' && ConsonanteLast === 'n') ||
					(ConsonanteCurr === 'p' && ConsonanteLast === 's') ||
					(ConsonanteCurr === 'm' && ConsonanteLast === 'n') ||
					(ConsonanteCurr === 'g' && ConsonanteLast === 'n') ||
					(ConsonanteCurr === 'f' && ConsonanteLast === 't') ||
					(ConsonanteCurr === 'p' && ConsonanteLast === 'n') ||
					(ConsonanteCurr === 'c' && ConsonanteLast === 'z') ||
					(ConsonanteCurr === 't' && ConsonanteLast === 'z') ||
					(ConsonanteCurr === 't' && ConsonanteLast === 's')
				) {
					posicion++;
					return posicion;
				}

				if (
					ConsonanteLast === 'l' ||
					ConsonanteLast === 'r' || // Los grupos consonánticos formados por una consonante
					// seguida de 'l' o 'r' no pueden separarse y siempre inician
					// sílaba
					(ConsonanteCurr === 'c' && ConsonanteLast === 'h') || // 'ch'
					ConsonanteLast === 'y'
				) {
					// 'y' funciona como vocal
					posicion++; // Siguiente sílaba empieza en c2
				} else posicion += 2; // c3 inicia la siguiente sílaba
			}
		} else {
			if (ConsonanteCurr === 'y') return posicion;

			posicion += 2; // La palabra acaba con dos consonantes
		}
	}
	return posicion;
};

module.exports.getAccent = getAccent;
