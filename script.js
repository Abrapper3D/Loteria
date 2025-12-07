// ----------------------------------------------------
//  CONFIGURACIÓN: Lista de Loterías disponibles
// ----------------------------------------------------
const AVAILABLE_LOTTERIES = [
    { 
        name: "MATIAS", 
        folder: "DE MATIAS", 
        title_fill: "#a6a5d3", 
        title_stroke: "#000000", 
        title_size: "3.5em", 
        title_font: "'Comic Sans MS', cursive" 
    }
];

const TOTAL_CARDS = 52; 
const GIF_NAME = "Revolver.gif"; 
const DEFAULT_DISCARD_PATH = "Loterias/Default/Descartada.jpg"; // RUTA FIJA

// ----------------------------------------------------
// 📝 LISTA COMPLETA DE NOMBRES (INTEGRADA EN JS)
// ----------------------------------------------------
const CARD_NAMES_MAP_MATIAS = {
  "1": "MATE",
  "2": "SALLY",
  "3": "MACK",
  "4": "RAYO MCQUEEN",
  "5": "LUIGI",
  "6": "GUIDO",
  "7": "EL REY",
  "8": "DOC HUDSON",
  "9": "FLO",
  "10": "RAMON",
  "11": "FILMORE",
  "12": "CHICK HICKS",
  "13": "STANLEY",
  "14": "LIZZIE",
  "15": "SHERIFF",
  "16": "SARGENTO",
  "17": "FINN MCMISSILE",
  "18": "PROFESOR Z",
  "19": "MILES",
  "20": "HOLEY",
  "21": "IVAN",
  "22": "MEMO ROJAS",
  "23": "FRANCESCO",
  "24": "SIDDELEY",
  "25": "JAKSON STORM",
  "26": "MISS FRACTURA",
  "27": "CAL WEATHERS",
  "28": "CRUZ RAMIREZ",
  "29": "RUBBLE",
  "30": "EVEREST",
  "31": "MARSHALL",
  "32": "CHASE",
  "33": "TRACKER",
  "34": "ZUMA",
  "35": "ROCKY",
  "36": "SKYE",
  "37": "REX",
  "38": "WILD",
  "39": "APOLO",
  "40": "RYDER",
  "41": "DONNIE",
  "42": "DIZZY",
  "43": "JETT",
  "44": "SKY",
  "45": "ASTRA",
  "46": "CHASE",
  "47": "PAUL",
  "48": "ROY",
  "49": "MIRA",
  "50": "REMI",
  "51": "JIMBO",
  "52": "SPARKY"
};


// ----------------------------------------------------
// VARIABLES DOM y DE ESTADO
// ----------------------------------------------------
let deck = [];
let currentIndex = 0;
let CARD_NAMES_MAP = {}; 
let CURRENT_LOTTERY_FOLDER = ""; 

const mainHeader = document.getElementById("main-header");
const lotterySelect = document.getElementById('lottery-select'); 

const cardElement = document.getElementById("card");
const frontImage = document.getElementById("frontImage");
const backImage = document.getElementById("backImage");
const discardImg = document.getElementById("discard-img");
const cardName = document.getElementById("card-name");
const container = document.querySelector(".container"); // Variable original

const drawButton = document.getElementById("draw-button");
const shuffleButton = document.getElementById("shuffle-button");

drawButton.disabled = true;
shuffleButton.disabled = true; 

// ----------------------------------------------------
// FUNCIÓN 1: PRE-CARGA DE IMÁGENES
// ----------------------------------------------------
const preloadImages = () => {
    for (let i = 1; i <= TOTAL_CARDS; i++) {
        const img = new Image();
        img.src = `${CURRENT_LOTTERY_FOLDER}card${i}.jpg`;
    }
    new Image().src = CURRENT_LOTTERY_FOLDER + GIF_NAME; 
};


// ----------------------------------------------------
// FUNCIÓN 2: CARGA SINCRÓNICA (changeLottery)
// ----------------------------------------------------
function changeLottery(lotteryFolder) {
    if (!lotteryFolder) return;
    
    const selectedLottery = AVAILABLE_LOTTERIES.find(l => l.folder === lotteryFolder);
    const readableName = selectedLottery ? selectedLottery.name : lotteryFolder;

    CURRENT_LOTTERY_FOLDER = `Loterias/${lotteryFolder}/`;
    const REVERSE_IMAGE_PATH = CURRENT_LOTTERY_FOLDER + "reverso.jpg";
    
    // ... (Código de estilos y configuración inicial) ...
    
    CARD_NAMES_MAP = CARD_NAMES_MAP_MATIAS; 
    mainHeader.textContent = `LOTERIA DE ${readableName}`; 

    shuffleButton.disabled = true;
    drawButton.disabled = true;
    cardName.textContent = `Cargando Lotería de ${readableName}...`; 

    try {
        // Configurar imágenes con la ruta dinámica
        frontImage.src = REVERSE_IMAGE_PATH; // Cara oculta
        backImage.src = REVERSE_IMAGE_PATH;  // Cara visible (Mazo)
        discardImg.src = DEFAULT_DISCARD_PATH; // Imagen de default
        
        preloadImages(); 

        cardName.textContent = `LISTO PARA INICIAR`; 
        shuffleButton.disabled = false; 
    } catch (error) {
        console.error("Error al configurar la lotería:", error);
        mainHeader.textContent = `LOTERIA`; 
        cardName.textContent = `Error al cargar las imágenes de '${readableName}'.`; 
        shuffleButton.disabled = true; 
    }
}


// ----------------------------------------------------
// FUNCIÓN 3: BARAJEAR (SHUFFLE) - CORREGIDA PARA GIF
// ----------------------------------------------------
function shuffleDeck() {
    cardName.textContent = "Barajado...";

    drawButton.disabled = true; 
    shuffleButton.disabled = true;

    deck = [];
    for (let i = 1; i <= TOTAL_CARDS; i++) deck.push(i);
    deck.sort(() => Math.random() - 0.5);
    currentIndex = 0;

    const REVERSE_PATH = CURRENT_LOTTERY_FOLDER + "reverso.jpg";
    const GIF_PATH = CURRENT_LOTTERY_FOLDER + GIF_NAME; 

    // Resetear las dos caras de la carta
    frontImage.src = REVERSE_PATH;
    backImage.src = REVERSE_PATH; // Asegurar que empieza con el reverso estático
    discardImg.src = DEFAULT_DISCARD_PATH; 

    cardElement.style.transform = "none";
    
    //  Aplicación directa del GIF (sin rutas fijas de default)
    backImage.src = GIF_PATH; 
    
    setTimeout(() => {
        backImage.src = REVERSE_PATH; // Quita el GIF y pone el reverso estático
        cardName.textContent = "Listo. ¡A sacar cartas!";
        drawButton.disabled = false;
        shuffleButton.disabled = false;
    }, 1500);
}

// ----------------------------------------------------
// FUNCIÓN 4: SACAR CARTA (DRAW CARD) - CORREGIDA PARA LÓGICA
// ----------------------------------------------------
function drawCard() {
    if (currentIndex >= deck.length) {
        cardName.textContent = "El mazo está vacío. ¡Barajea de nuevo!";
        drawButton.disabled = true;
        return;
    }

    const cardNum = deck[currentIndex];
    const newCardPath = `${CURRENT_LOTTERY_FOLDER}card${cardNum}.jpg`;
    const REVERSE_PATH = CURRENT_LOTTERY_FOLDER + "reverso.jpg";
    const cardNameText = CARD_NAMES_MAP[cardNum.toString()] || `Error: Carta ${cardNum}`;

    drawButton.disabled = true;
    
    // 1. ANTES DE GIRAR: Colocar la carta ganadora en la cara OCULTA
    frontImage.src = newCardPath;
    
    // 2. Iniciar giro
    cardElement.style.transform = "rotateY(180deg)";

    // 3. (300ms) Punto medio: El frontImage se revela
    setTimeout(() => {
        // En este punto, el frontImage (carta) está visible.
        discardImg.src = newCardPath;
        cardName.textContent = cardNameText; 
        
        //  CRÍTICO: La backImage (el reverso) se prepara para el siguiente turno, 
        // pero esta cara está girada 180 grados y oculta actualmente.

    }, 300);

    // 4. (400ms) Finaliza el giro: Regresar el contenedor a la posición de reposo
    setTimeout(() => {
        cardElement.style.transform = "none";
        currentIndex++;
        
        if (currentIndex < deck.length) {
            drawButton.disabled = false;
        } else {
            drawButton.disabled = true;
            cardName.textContent = "¡Mazo completado! Barajea para continuar.";
        }
        
        // La backImage ya tiene el REVERSE_PATH (del paso 3).
        // En tu código original, el setTimeout(0) es redundante si ya lo hiciste en el paso 3.

    }, 400);
}

// ----------------------------------------------------
// INICIALIZACIÓN AL CARGAR LA PÁGINA
// ----------------------------------------------------
document.addEventListener('DOMContentLoaded', (event) => {
    // 1. Poblar el selector con las loterías disponibles
    // ... (código de poblar selector) ...
    lotterySelect.innerHTML = '';
    const defaultOption = document.createElement('option');
    defaultOption.value = "";
    defaultOption.textContent = "--- Selecciona una Lotería ---";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    lotterySelect.appendChild(defaultOption);
    AVAILABLE_LOTTERIES.forEach((lottery) => {
        const option = document.createElement('option');
        option.value = lottery.folder;
        option.textContent = `Lotería de ${lottery.name}`;
        lotterySelect.appendChild(option);
    });

    // 2. Establecer el estado inicial
    mainHeader.textContent = "LOTERIA";
    cardName.textContent = "Selecciona una Lotería para comenzar.";
    
    // 🚨 Configurar la imagen de descarte inicial
    discardImg.src = DEFAULT_DISCARD_PATH;
    
    // Aquí, frontImage y backImage deben cargar una imagen por defecto
    // si existen Loterias/Default/reverso.jpg. Si no existe, no ponemos nada para evitar errores.
});