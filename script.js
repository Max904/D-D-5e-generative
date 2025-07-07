const generateBtn = document.getElementById('generateBtn');
const campaignOutput = document.getElementById('campaignOutput'); // Changed ID to campaignOutput
const userPromptInput = document.getElementById('userPromptInput'); // Get the user prompt input field
// New elements for Saved Campaigns
const saveCurrentCampaignBtn = document.getElementById('saveCurrentCampaignBtn');
const savedCampaignTabs = document.getElementById('savedCampaignTabs');

// New elements for Character Generator
const generateCharacterBtn = document.getElementById('generateCharacterBtn');
const characterOutput = document.getElementById('characterOutput');
const characterPromptInput = document.getElementById('characterPromptInput');

// New elements for Saved Characters
const saveCurrentCharacterBtn = document.getElementById('saveCurrentCharacterBtn');
const savedCharacterTabs = document.getElementById('savedCharacterTabs');


// Language selector
const languageSelect = document.getElementById('languageSelect');

// Variable to store the last generated campaign text (raw)
let lastGeneratedCampaignRawText = '';
// Variable to store the last prompt used for campaign generation
let lastCampaignPrompt = '';


// Variable to store the last generated character text (raw)
let lastGeneratedCharacterRawText = '';
// Variable to store the last prompt used for character generation
let lastCharacterPrompt = '';


// Arrays to store saved objects - Use localStorage to persist saves
let savedCampaigns = JSON.parse(localStorage.getItem('savedCampaigns')) || [];
let savedCharacters = JSON.parse(localStorage.getItem('savedCharacters')) || [];

// --- API Key Obfuscation ---
// Function to decode a simple base64 encoded string
function decode(encoded) {
    return atob(encoded);
}

// Store the encoded key
const encodedApiKey = 'Z3NrXzJ3VXpySktFNkE5Q1NRWnlJbUhXR2R5YjNGWWdMbHB0NGJJa2gyU2ZuMnJ0d3lpcWtoSg=='; // Base64 encoded

// Get the API key by decoding it
const getApiKey = () => decode(encodedApiKey);

// --- Language Translation Data ---
const translations = {
    es: {
        page_title: "Generador de Campañas D&D 5e",
        campaign_generator_title: "Generador de Campañas D&D 5e",
        language_label: "Idioma:",
        campaign_description: "Haz clic en el botón para generar una nueva idea de campaña completa para tu próxima aventura.",
        user_prompt_label: "Personaliza tu Campaña (Opcional):",
        user_prompt_placeholder: "Ej: La campaña ocurre en un desierto de cristal, los PNJs son todos no-muertos, debe haber un dragón celestial...",
        generate_campaign_button: "Generar Campaña",
        campaign_output_initial_message: "Presiona [Generar Campaña] para empezar",
        campaign_output_loading: "Cargando campaña... ¡prepárate para la aventura!",
        character_generator_title: "Generador de Personajes",
        character_description: "Genera ideas para personajes jugadores (PNJs) o personajes no jugadores (PNJs) con un clic.",
        character_prompt_label: "Personaliza tu Personaje (Opcional):",
        character_prompt_placeholder: "Ej: Un elfo druida ermitaño, un guerrero tiefling con un pasado oscuro, un bardo gnomo amante de las fiestas...",
        generate_character_button: "Generar Personaje",
        character_output_initial_message: "Presiona [Generar Personaje] para empezar", // This is the initial message before any generation or save selection
        character_output_loading: "Generando personaje... ¡un nuevo héroe (o villano) emerge!",
        user_idea_considered_prefix: "Tu Idea Considerada:",
         user_idea_only_suffix: "", // No extra text if only user idea
         context_only_suffix: "basado en la campaña actual.",
         user_idea_and_context_suffix: "y basado en la campaña actual.",
        error_message_prefix: "Error al generar el contenido.",
        error_message_details_prefix: "Detalles:",
        // Translations for saved characters
        saved_characters_title: "Personajes Guardados",
        save_character_button: "Guardar Personaje Actual",
        saved_characters_description: "Selecciona un personaje de la lista para ver sus detalles. Haz clic en \"Guardar Personaje Actual\" para añadir el personaje recién generado.",
        saved_character_initial_message: "Selecciona un personaje de la lista de arriba.", // Message shown when saved characters exist but none are selected
        save_error_no_character: "No hay personaje para guardar. Genera uno primero.",
        save_success_character: "Personaje guardado: ",
        delete_character_button: "X", // Button to delete a character
        delete_confirm_character: "¿Estás seguro de que quieres eliminar a ",
         unnamed_character: "Personaje sin nombre", // Translation for default name
        // New translations for saved campaigns
        saved_campaigns_title: "Campañas Guardadas",
        save_campaign_button: "Guardar Campaña Actual",
        saved_campaigns_description: "Selecciona una campaña de la lista para ver sus detalles. Haz clic en \"Guardar Campaña Actual\" para añadir la campaña recién generada.",
        saved_campaign_initial_message: "Selecciona una campaña de la lista de arriba.", // Message shown when saved campaigns exist but none are selected
        save_error_no_campaign: "No hay campaña para guardar. Genera una primero.",
        save_success_campaign: "Campaña guardada: ",
        delete_campaign_button: "X", // Button to delete a campaign
        delete_confirm_campaign: "¿Estás seguro de que quieres eliminar la campaña ",
        unnamed_campaign: "Campaña sin nombre" // Translation for default name
    },
    en: {
        page_title: "D&D 5e Campaign Generator",
        campaign_generator_title: "D&D 5e Campaign Generator",
        language_label: "Language:",
        campaign_description: "Click the button to generate a complete new campaign idea for your next adventure.",
        user_prompt_label: "Customize Your Campaign (Optional):",
        user_prompt_placeholder: "Ex: The campaign takes place in a crystal desert, all NPCs are undead, there must be a celestial dragon...",
        generate_campaign_button: "Generate Campaign",
        campaign_output_initial_message: "Press [Generate Campaign] to start",
        campaign_output_loading: "Loading campaign... get ready for the adventure!",
        character_generator_title: "Character Generator",
        character_description: "Generate ideas for player characters (PCs) or non-player characters (NPCs) with a click.",
        character_prompt_label: "Customize Your Character (Optional):",
        character_prompt_placeholder: "Ex: An elven hermit druid, a tiefling warrior with a dark past, a party-loving gnome bard...",
        generate_character_button: "Generate Character",
        character_output_initial_message: "Press [Generate Character] to start", // This is the initial message before any generation or save selection
        character_output_loading: "Generating character... a new hero (or villain) emerges!",
        user_idea_considered_prefix: "Your Idea Considered:",
         user_idea_only_suffix: "", // No extra text if only user idea
         context_only_suffix: "based on the current campaign.",
         user_idea_and_context_suffix: "and based on the current campaign.",
        error_message_prefix: "Error generating content.",
        error_message_details_prefix: "Details:",
        // Translations for saved characters
        saved_characters_title: "Saved Characters",
        save_character_button: "Save Current Character",
        saved_characters_description: "Select a character from the list to view their details. Click \"Save Current Character\" to add the newly generated character.",
        saved_character_initial_message: "Select a character from the list above.", // Message shown when saved characters exist but none are selected
        save_error_no_character: "No character to save. Generate one first.",
        save_success_character: "Character saved: ",
        delete_character_button: "X",
        delete_confirm_character: "Are you sure you want to delete ",
        unnamed_character: "Unnamed Character", // Translation for default name
         // New translations for saved campaigns
        saved_campaigns_title: "Saved Campaigns",
        save_campaign_button: "Save Current Campaign",
        saved_campaigns_description: "Select a campaign from the list to view their details. Click \"Save Current Campaign\" to add the newly generated campaign.",
        saved_campaign_initial_message: "Select a campaign from the list above.", // Message shown when saved campaigns exist but none are selected
        save_error_no_campaign: "No campaign to save. Generate one first.",
        save_success_campaign: "Campaign saved: ",
        delete_campaign_button: "X",
        delete_confirm_campaign: "Are you sure you want to delete campaign ",
        unnamed_campaign: "Unnamed Campaign" // Translation for default name
    }
};

// Mapping language codes to full names for API prompt
const languageNames = {
    es: "Español",
    en: "English"
};

// Function to set the language
function setLanguage(lang) {
    const elements = document.querySelectorAll('[data-i18n]:not([data-i18n-placeholder])'); // Exclude elements that only have placeholder translations
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });

    const placeholders = document.querySelectorAll('[data-i18n-placeholder]');
     placeholders.forEach(element => {
         const key = element.getAttribute('data-i18n-placeholder');
         if (translations[lang] && translations[lang][key]) {
             element.placeholder = translations[lang][key];
         }
     });

    // Update the initial loading/placeholder messages manually if they are visible
    // Check if the current content of campaignOutput is one of the known initial/loading/saved messages
    const currentCampaignText = campaignOutput.textContent.trim();
    const campaignInitialMessages = Object.values(translations).map(t => t?.campaign_output_initial_message).filter(msg => msg);
    const campaignLoadingMessages = Object.values(translations).map(t => t?.campaign_output_loading).filter(msg => msg);
    const campaignSavedInitialMessages = Object.values(translations).map(t => t?.saved_campaign_initial_message).filter(msg => msg);
    const allKnownCampaignMessages = [...campaignInitialMessages, ...campaignLoadingMessages, ...campaignSavedInitialMessages];

     let shouldUpdateCampaignOutput = false;
     const campaignOutputActualText = campaignOutput.textContent.trim();
     for (const knownMsg of allKnownCampaignMessages) {
          if (campaignOutputActualText === knownMsg) {
               shouldUpdateCampaignOutput = true;
               break;
          }
     }

    if (shouldUpdateCampaignOutput) {
        // If it is, update to the new language's initial message
         if (savedCampaigns.length > 0) {
              campaignOutput.innerHTML = `<p class="loading-message" data-i18n="saved_campaign_initial_message">${translations[lang]?.saved_campaign_initial_message || 'Select a campaign from the list above.'}</p>`;
         } else {
              campaignOutput.innerHTML = `<p class="loading-message" data-i18n="campaign_output_initial_message">${translations[lang]?.campaign_output_initial_message || 'Press [Generate Campaign] to start'}</p>`;
         }
    }
    // Otherwise, leave the generated campaign content as is.


    // Check if the current content of characterOutput is one of the known initial/loading/saved messages
    const currentCharacterText = characterOutput.textContent.trim();
    const characterInitialMessages = Object.values(translations).map(t => t?.character_output_initial_message).filter(msg => msg);
    const characterLoadingMessages = Object.values(translations).map(t => t?.character_output_loading).filter(msg => msg);
    const characterSavedInitialMessages = Object.values(translations).map(t => t?.saved_character_initial_message).filter(msg => msg);
    const allKnownCharacterMessages = [...characterInitialMessages, ...characterLoadingMessages, ...characterSavedInitialMessages];


    let shouldUpdateCharacterOutput = false;
    // Get the actual text content without any HTML tags
    const characterOutputActualText = characterOutput.textContent.trim();

    for (const knownMsg of allKnownCharacterMessages) {
         if (characterOutputActualText === knownMsg) {
              shouldUpdateCharacterOutput = true;
              break;
         }
    }


    if (shouldUpdateCharacterOutput) {
         // If it is, determine the correct initial message for the new language
         if (savedCharacters.length > 0) {
              // Use 'lang' instead of 'currentLang' here
              characterOutput.innerHTML = `<p class="loading-message" data-i18n="saved_character_initial_message">${translations[lang]?.saved_character_initial_message || 'Select a character from the list above.'}</p>`;
         } else {
              // Use 'lang' instead of 'currentLang' here
              characterOutput.innerHTML = `<p class="loading-message" data-i18n="character_output_initial_message">${translations[lang]?.character_output_initial_message || 'Press [Generate Character] to start'}</p>`;
         }
    }
    // Otherwise, leave the generated/saved character content as is.


    // Update the lang attribute on the HTML tag
    document.documentElement.lang = lang;

    // Re-render saved tabs to update delete button text if visible
    renderSavedCharacterTabs();
    renderSavedCampaignTabs();

    // If a saved character is currently displayed, re-display it to update internal text (like prompt note)
    const activeCharacterTab = savedCharacterTabs.querySelector('button.saved-item-tab.active'); // Find the active tab button specifically
    if (activeCharacterTab) {
        const index = parseInt(activeCharacterTab.getAttribute('data-index'), 10);
        displaySavedCharacter(index); // Display the active character again to re-render with correct language prompt note
    }

    // If a saved campaign is currently displayed, re-display it
     const activeCampaignTab = savedCampaignTabs.querySelector('button.saved-item-tab.active'); // Find the active tab button specifically
     if (activeCampaignTab) {
         const index = parseInt(activeCampaignTab.getAttribute('data-index'), 10);
         displaySavedCampaign(index); // Display the active campaign again
     }
}

// Event listener for language change
languageSelect.addEventListener('change', (event) => {
    setLanguage(event.target.value);
});

// Set initial language on page load and load saved items
document.addEventListener('DOMContentLoaded', () => {
    setLanguage(languageSelect.value); // Set language based on the default selected option and handle initial messages
    renderSavedCharacterTabs(); // Render saved characters on load
    renderSavedCampaignTabs(); // Render saved campaigns on load

    // If there are saved campaigns on load, display the first one
     if (savedCampaigns.length > 0) {
         displaySavedCampaign(0);
     }
     // If there are saved characters on load, display the first one
     if (savedCharacters.length > 0) {
         // Only display the first character if no campaign was displayed first
         // or if campaign display completed without showing a campaign (e.g. list was empty)
          if (campaignOutput.textContent.trim() === translations[languageSelect.value]?.campaign_output_initial_message || campaignOutput.textContent.trim() === translations[languageSelect.value]?.saved_campaign_initial_message) {
             // Ensure campaign output is in its initial state before displaying a character automatically
              displaySavedCharacter(0);
          }
     }
});


async function generateCampaign() {
    // Update loading message based on current language
    const currentLang = languageSelect.value;
    campaignOutput.innerHTML = `<p class="loading-message">${translations[currentLang]?.campaign_output_loading || 'Loading...'}</p>`;
    lastGeneratedCampaignRawText = ''; // Clear previous campaign text
    lastCampaignPrompt = userPromptInput.value.trim(); // Store the prompt used

     // Remove active class from any saved tabs when generating a new campaign
    const activeTabs = savedCampaignTabs.querySelectorAll('button.saved-item-tab.active'); // Select specific button
    activeTabs.forEach(tab => tab.classList.remove('active'));


    const userPrompt = lastCampaignPrompt;
    const targetLanguageName = languageNames[currentLang] || languageNames['es']; // Default to Spanish if language code is unknown

    // Base System prompt in Spanish - REINFORCED FORMATTING
    // Adjusted system prompt to remove explicit "[Nombre de la Campaña]" example
    let systemContent = `Eres un maestro narrador experto en diseñar campañas de rol de fantasía para Dungeons & Dragons 5e. Tu estilo es narrativo, detallado y estructurado, con mundos vivos, personajes relevantes y mecánicas únicas. Genera campañas completas con tono épico y emocional que puedan ser jugadas en múltiples sesiones.

**Instrucción CRUCIAL y PRIORITARIA sobre Formato:** DEBES utilizar EXCLUSIVAMENTE UNO de los siguientes TRES tipos de marcadores para estructurar la respuesta y aplicar negrita. Cualquier otro símbolo como *, #, -, + está ABSOLUTAMENTE PROHIBIDO para dar formato.

1.  **Título Principal (Nombre de la Campaña):** La PRIMERA línea de tu respuesta DEBE contener EXCLUSIVAMENTE el nombre de la campaña encerrado en SOLO CORCHETES [ ], y ABSOLUTAMENTE NADA MÁS. Ejemplo: [El Legado del Sol Quebrantado]
2.  **Subtítulos de Sección:** Usa SOLO COMILLAS SIMPLES ' ' al inicio de una línea. Ejemplo: 'Sinopsis General'
3.  **Negrita dentro de párrafos:** Usa SOLO ACENTOS CIRCUNFLEJOS ^ ^ para rodear el texto a poner en negrita dentro de un párrafo. Ejemplo: ^Nombre del PNJ^.

**ABSOLUTAMENTE PROHIBIDO** usar CUALQUIER otro símbolo o estructura para el formato principal de títulos, subtítulos, o negrita (por ejemplo: *, **, #, ##, -, +, 1., --, ==, etc.). Solo se permiten [ ], ' ', y ^ ^ para dar estructura o negrita.

Dentro del texto normal y las descripciones, puedes usar puntuación estándar como comas, puntos, signos de interrogación, exclamación, y DOS PUNTOS (:), pero NUNCA los uses para definir una nueva sección, una lista numerada, o cualquier estructura fuera de los marcadores [ ], ' ', ^ ^. La estructura ^Rasgo^: Descripción es la única excepción permitida para usar ':' después de texto en ^ ^ negrita, y se usa solo para listas de rasgos/estadísticas.

**Instrucción Clave de Contenido y Estructura Rigurosa:**
La PRIMERA línea de tu respuesta DEBE ser EXCLUSIVAMENTE el nombre de la campaña encerrado en CORCHETES [ ]. ABSOLUTAMENTE NADA MÁS en esa línea.
La SEGUNDA línea DEBE ser EXACTAMENTE el subtítulo 'Sinopsis General', iniciando esta sección.
A partir de la tercera línea, incluye SIEMPRE los siguientes elementos, utilizando EXCLUSIVAMENTE los marcadores especificados, en este orden **EXACTO** y **SIN TEXTO ADICIONAL NI SALDOS DE LÍNEA EXTRA** entre las secciones principales (salvo los saltos de línea necesarios *dentro* de la sección 'Arco Narrativo Principal' antes de cada ^Acto X^), en este orden:

'Sinopsis General' (máx. 300 palabras) <- ESTA DEBE SER LA SEGUNDA LÍNEA, INMEDIATAMENTE DESPUÉS DEL NOMBRE.
'Ambientación' <- DEBE SEGUIR INMEDIATAMENTE DESPUÉS DEL CONTENIDO DE LA SECCIÓN ANTERIOR.
'Arco Narrativo Principal' (dividido en 3 actos con evolución del conflicto. Para la estructura de los actos, cada ^Acto X^ y su descripción DEBEN estar separados del texto anterior y siguiente por una LÍNEA EN BLANCO. Puedes usar ^Acto I^, ^Acto II^, ^Acto III^ dentro del texto de esta sección, pero cada uno DEBE ir precedido por un salto de línea.) <- DEBE SEGUIR INMEDIATAMENTE DESPUÉS DEL CONTENIDO DE LA SECCIÓN ANTERIOR.
'Ganchos de Inicio' (3 ganchos distintos: por alineamiento, región o historia personal) <- DEBE SEGUIR INMEDIATAMENTE DESPUÉS DEL CONTENIDO DE LA SECCIÓN ANTERIOR.
'Misiones Principales y Secundarias' (5 de cada tipo. Las principales conectadas al arco, las secundarias con profundidad opcional) <- DEBE SEGUIR INMEDIATAMENTE DESPUÉS DEL CONTENIDO DE LA SECCIÓN ANTERIOR.
'Elementos Únicos de Juego' (sistemas de poder, eventos climáticos, mecánicas caseras, objetos especiales o decisiones globales) <- DEBE SEGUIR INMEDIATAMENTE DESPUÉS DEL CONTENIDO DE LA SECCIÓN ANTERIOR.
'Finales Posibles' (mínimo 3: uno esperanzador, uno trágico y uno ambiguo/abierto) <- DEBE SEGUIR INMEDIATAMENTE DESPUÉS DEL CONTENIDO DE LA SECCIÓN ANTERIOR. ESTA DEBE SER LA ÚLTIMA SECCIÓN.

Tu narrativa debe tener una atmósfera mística y grandiosa, como una saga inolvidable donde cada PNJ tiene impacto y cada región guarda secretos. El tono debe invitar a la aventura, la reflexión y la toma de decisiones difíciles.`;

     // Add language instruction to the system prompt
     systemContent += `\n\nLa respuesta final DEBE ser generada completamente en ${targetLanguageName}, utilizando SIEMPRE los marcadores [ ], ' ', y ^ ^ según las instrucciones cruciales de formato, y SOLO esos marcadores para dar estructura o negrita. ¡Sigue el formato exacto! ABSOLUTAMENTE NADA de texto introductorio o prefacios antes de la primera línea con el nombre.`;


    // User message is also in Spanish, with language instruction
    let userMessage = userPrompt ? `Considera también la siguiente idea del usuario: "${userPrompt}".` : "Genera una campaña épica de fantasía.";
    userMessage += ` Por favor, genera la respuesta en ${targetLanguageName} y sigue **estrictamente** el formato especificado en las instrucciones del sistema, usando [ ], ' ', y ^ ^ para títulos, subtítulos y negrita, y solo esos marcadores para esos propósitos. Asegúrate de incluir líneas en blanco antes de cada ^Acto X^ en la sección 'Arco Narrativo Principal'. Recuerda: la PRIMERA LÍNEA es SOLO el nombre [Nombre de la Campaña], y la SEGUNDA línea es SOLO el subtítulo 'Sinopsis General'.`;


    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${getApiKey()}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "llama3-8b-8192",
                temperature: 0.9,
                messages: [
                    { role: "system", content: systemContent },
                    { role: "user", content: userMessage }
                ],
                 max_tokens: 3000 // Request more tokens for a longer response
            })
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`API error! status: ${response.status}, body: ${errorBody}`);
        }

        const data = await response.json();
        const campaignText = data.choices[0].message.content;

        // Log the raw API response data and the extracted text
        console.log("Campaign API Response Data:", data);
        console.log("Raw Campaign Text:", campaignText);


        // Store the raw text for character generation reference and saving
        lastGeneratedCampaignRawText = campaignText;

        // Parse the text response and format it into HTML
        campaignOutput.innerHTML = formatTextOutput(campaignText, 'campaign'); // Pass type to format function

        // Add the user prompt suggestion at the end if a prompt was provided
        if (userPrompt) {
             let promptNote = `<strong>${translations[currentLang]?.user_idea_considered_prefix || 'Idea Considered:'}</strong>`;
             promptNote += ` "${userPrompt}"`;

            campaignOutput.innerHTML += `
                <p class="italic-prompt">
                    ${promptNote}
                </p>
            `;
        }


    } catch (error) {
        console.error("Error fetching campaign:", error);
         // Update error message based on current language
        campaignOutput.innerHTML = `
            <p class="error-message">
                ${translations[currentLang]?.error_message_prefix || 'Error generating content.'}
                <br>${translations[currentLang]?.error_message_details_prefix || 'Details:'} ${error.message}
            </p>`;
             lastGeneratedCampaignRawText = ''; // Clear text on error
             lastCampaignPrompt = ''; // Clear prompt on error
    }
}

// New function to generate a character
async function generateCharacter() {
    // Update loading message based on current language
    const currentLang = languageSelect.value;
    characterOutput.innerHTML = `<p class="loading-message">${translations[currentLang]?.character_output_loading || 'Generating character...'}</p>`;
    lastGeneratedCharacterRawText = ''; // Clear previous character text
    lastCharacterPrompt = characterPromptInput.value.trim(); // Store the prompt used

    // Remove active class from any saved tabs when generating a new character
    const activeTabs = savedCharacterTabs.querySelectorAll('button.saved-item-tab.active'); // Select specific button
    activeTabs.forEach(tab => tab.classList.remove('active'));


    const userPrompt = lastCharacterPrompt; // Use the stored prompt
    const targetLanguageName = languageNames[currentLang] || languageNames['es']; // Default to Spanish if language code is unknown


    const apiUrl = "https://api.groq.com/openai/v1/chat/completions";
    const apiKey = getApiKey(); // Use the obfuscated key

    // System prompt for character generation - Updated to accept campaign context - REINFORCED FORMATTING
    // Base System prompt in Spanish
    let systemContent = `Eres un creador de personajes de rol de fantasía experto en Dungeons & Dragons 5e. Genera conceptos de personajes interesantes para jugar como PNJ o incluso como base para PJ.

**Instrucción CRUCIAL y PRIORITARIA sobre Formato:** DEBES utilizar EXCLUSIVAMENTE UNO de los siguientes TRES tipos de marcadores para estructurar la respuesta y aplicar negrita. Cualquier otro símbolo como *, #, -, + está ABSOLUTAMENTE PROHIBIDO para dar formato.

1.  **Nombre del Personaje (Primera Línea):** Usa SOLO CORCHETES [ ] para encerrar ÚNICAMENTE el nombre real del personaje en la PRIMERA línea. Ejemplo: [Elara Corazón de Roble]
2.  **Subtítulos de Sección:** Usa SOLO COMILLAS SIMPLES ' ' al inicio de una línea. Ejemplo: 'Raza y Clase'
3.  **Negrita dentro de párrafos:** Usa SOLO ACENTOS CIRCUNFLEJOS ^ ^ para rodear el texto a poner en negrita dentro de un párrafo. Ejemplo: ^Habilidades Especiales^.

**ABSOLUTAMENTE PROHIBIDO** usar CUALQUIER otro símbolo o estructura para el formato principal de títulos, subtítulos, o negrita (por ejemplo: *, **, #, ##, -, +, 1., --, ==, etc.). Solo se permiten [ ], ' ', y ^ ^ para dar estructura o negrita.

Dentro del texto normal y las descripciones, puedes usar puntuación estándar como comas, puntos, signos de interrogación, exclamación, y DOS PUNTOS (:), pero NUNCA los uses para definir una nueva sección, una lista numerada, o cualquier estructura fuera de los marcadores [ ], ' ', ^ ^. La estructura ^Rasgo^: Descripción es la única excepción permitida para usar ':' después de texto en ^ ^ negrita, y se usa solo para listas de rasgos/estadísticas.

**Instrucción Clave de Contenido y Estructura Rigurosa:**
Te proporcionaré el texto de una campaña de D&D 5e que se generó previamente (si está disponible). Tu tarea es crear un personaje que sea **relevante** para esa campaña. Considera su ambientación, conflicto principal, PNJs clave, misiones, etc. El personaje debe encajar de forma natural en el mundo de la campaña, quizás como un habitante local, un posible aliado, un rival, alguien con una misión secundaria que se relacione, etc. Asegúrate de que su historia, motivaciones y ganchos de historia se relacionen directamente con los elementos de la campaña proporcionada.

Si no se proporciona contexto de campaña (el texto está vacío), o si el contexto parece irrelevante para tu solicitud específica, genera un personaje genérico interesante.

Incluye SIEMPRE los siguientes elementos, utilizando EXCLUSIVAMENTE los marcadores especificados, en este orden **EXACTO** y **SIN TEXTO ADICIONAL NI SALDOS DE LÍNEA EXTRA** entre ellos (salvo los estrictamente necesarios para separar líneas según el formato):

[<Aquí va solo el Nombre del Personaje>] <- ESTA DEBE SER LA PRIMERA LÍNEA Y CONTENER SOLO EL NOMBRE DEL PERSONAJE. ABSOLUTAMENTE NADA MÁS.
'Raza y Clase' <- ESTA DEBE SER LA SEGUNDA LÍNEA, INMEDIATAMENTE DESPUÉS DEL NOMBRE. CONTENDRÁ SOLO EL TÍTULO 'Raza y Clase'.
(En la(s) línea(s) *siguiente(s)* a este subtítulo, indica la raza y la clase del personaje. **NO** incluyas descripciones adicionales en estas líneas, ni vuelvas a mencionar el nombre del personaje. Ejemplo de contenido para esta sección: "Elfo Bardo".)
'Trasfondo Breve' (Que se relacione con la campaña si se proporciona. Este subtítulo debe seguir inmediatamente después del contenido de 'Raza y Clase'.)
'Descripción Física Breve' (Este subtítulo debe seguir inmediatamente después del contenido de 'Trasfondo Breve'.)
'Rasgos de Personalidad' (3-5 clave. Formatea el nombre de CADA rasgo en negrita usando ^ ^, seguido de dos puntos y su descripción, CADA UNO EN UNA LÍNEA NUEVA. Ejemplo: ^Valiente^: Siempre dispuesto a enfrentarse al peligro. **SOLO** el nombre del rasgo va en negrita.)
'Estadísticas' (Incluye los siguientes valores estimados, **CADA UNO EN UNA LÍNEA NUEVA**. Para ^Puntos de Golpe^ y ^Puntos de Armadura^, solo el número (ej: ^Puntos de Golpe^: 35). Para ^Fuerza^, ^Destreza^, ^Constitución^, ^Inteligencia^, ^Sabiduría^ y ^Carisma^, incluye el número base y el bonificador entre paréntesis, ej: ^Fuerza^: 14 (+2). **NO** incluyas descripciones adicionales en esta sección. Solo las estadísticas en el formato especificado, separadas por saltos de línea, usando negrita ^ ^ para el nombre de la estadística y ':' para separarla del valor. Este subtítulo debe seguir inmediatamente después del contenido de 'Rasgos de Personalidad'.)
'Gancho de Historia/Conexión con la Campaña' (Explica cómo este personaje encaja o interactúa con la trama o el mundo de la campaña proporcionada. Si no hay campaña, cómo encajaría en una aventura típica. Este subtítulo debe seguir inmediatamente después del contenido de 'Estadísticas'. Esta debe ser la última sección.)

Asegúrate de que el personaje sea interesante y tenga potencial narrativo. El tono debe ser evocador y conciso.`;

    // Add language instruction to the system prompt
    systemContent += `\n\nLa respuesta final DEBE ser generada completamente en ${targetLanguageName}, utilizando SIEMPRE los marcadores [ ], ' ', y ^ ^ según las instrucciones cruciales de formato, y SOLO esos marcadores para dar estructura o negrita. ¡Sigue el formato exacto y usa solo esos marcadores! ABSOLUTAMENTE NADA de texto introductorio o prefacios antes de la primera línea con el nombre.`;


    // Combine campaign context and user prompt for the user message
    // User message is also in Spanish
    let userMessage = "";
    if (lastGeneratedCampaignRawText) { // Use raw text for context
        userMessage += "Considera la siguiente campaña al generar el personaje:\n\n-- INICIO CONTEXTO CAMPAÑA --\n";
        userMessage += lastGeneratedCampaignRawText; // Use the raw text
        userMessage += "\n-- FIN CONTEXTO CAMPAÑA --\n\n";
        userMessage += "Ahora, "; // Add connective text
    }

    userMessage += userPrompt ? `Genera un personaje considerando la siguiente idea del usuario: "${userPrompt}".` : "Genera un personaje de fantasía para D&D 5e.";
    userMessage += ` Por favor, genera la respuesta en ${targetLanguageName} y sigue **estrictamente** el formato especificado en las instrucciones del sistema, usando [ ], ' ', y ^ ^ para títulos, subtítulos y negrita, y solo esos marcadores para esos propósitos. Recuerda: la PRIMERA LÍNEA es SOLO el nombre [Nombre del Personaje], y la SEGUNDA línea es SOLO el subtítulo 'Raza y Clase'.`;


     try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "llama3-8b-8192", // Using the same model
                temperature: 0.9,
                messages: [
                    { role: "system", content: systemContent },
                    { role: "user", content: userMessage }
                ],
                 max_tokens: 1500 // Slightly increased tokens for potentially more detailed connections
            })
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`API error! status: ${response.status}, body: ${errorBody}`);
        }

        const data = await response.json();
        const characterText = data.choices[0].message.content;

        // Log the raw API response data and the extracted text
        console.log("Character API Response Data:", data);
        console.log("Raw Character Text:", characterText);

        // Store the raw text before formatting
        lastGeneratedCharacterRawText = characterText;

        // Parse the text response and format it into HTML
        characterOutput.innerHTML = formatTextOutput(characterText, 'character'); // Pass type to format function

        // Add the user prompt suggestion at the end if a prompt was provided
        // Also mention if the campaign context was used
        let promptNote = '';
        let suffix = "";
        const prefix = `<strong>${translations[currentLang]?.user_idea_considered_prefix || 'Idea Considered:'}</strong>`;

         if (userPrompt && lastGeneratedCampaignRawText) {
             promptNote += `${prefix} "${userPrompt}"`;
             suffix = translations[currentLang]?.user_idea_and_context_suffix || ' and based on the current campaign.';
         } else if (userPrompt) {
             promptNote += `${prefix} "${userPrompt}"`;
             suffix = translations[currentLang]?.user_idea_only_suffix || '';
         } else if (lastGeneratedCampaignRawText) {
             // If only campaign context was used, the note should reflect that
             promptNote += `<strong>${translations[currentLang]?.user_idea_considered_prefix || 'Idea Considered:'}</strong> ${translations[currentLang]?.context_only_suffix || 'Based on the current campaign.'}`;
              suffix = ''; // No extra suffix needed here
         } else {
             // If neither prompt nor campaign context, don't add a note
             promptNote = '';
         }


        // Add the prompt note only if there was a prompt or campaign context
        if (promptNote) {
             characterOutput.innerHTML += `
                 <p class="italic-prompt">
                     ${promptNote} ${suffix}
                 </p>
             `;
        }


    } catch (error) {
        console.error("Error fetching character:", error);
         // Update error message based on current language
        characterOutput.innerHTML = `
            <p class="error-message">
                 ${translations[currentLang]?.error_message_prefix || 'Error generating content.'}
                <br>${translations[currentLang]?.error_message_details_prefix || 'Details:'} ${error.message}
            </p>`;
        lastGeneratedCharacterRawText = ''; // Clear raw text on error
        lastCharacterPrompt = ''; // Clear prompt on error
    }
}


// Renamed and modified format function to handle specific markers and paragraphs
// Added a 'type' parameter ('campaign' or 'character') to handle the first title differently
function formatTextOutput(text, type) {
    const lines = text.split('\n');
    let html = '';
    let currentParagraph = [];
    let firstTitleProcessed = false; // Flag to track the first [Title]

    const processParagraph = () => {
        if (currentParagraph.length > 0) {
            let paragraphContent = currentParagraph.join('\n'); // Join lines with newline temporarily for processing list items

             // Apply bold formatting for ^Text^ (do this first)
              paragraphContent = paragraphContent.replace(/\^([^^\n]+)\^/g, '<strong>$1</strong>');
              // Apply bold formatting for **Text** (fallback)
              paragraphContent = paragraphContent.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

             // Now, specifically handle list items like "<strong>Rasgo</strong>: Description" or "<strong>Stat</strong>: Value"
             // Split by lines to process each line within the paragraph block
             const processedLines = paragraphContent.split('\n');
             let listAwareHtml = '';

             processedLines.forEach(pLine => {
                // If the line is not empty, treat it as a paragraph.
                // This structure (each non-empty line after a blank line or title/subtitle is a paragraph)
                // aligns with how we want lists (Traits, Stats) and Acts to be displayed.
                if (pLine.trim() !== '') {
                   listAwareHtml += `<p>${pLine.trim()}</p>`;
                }
             });

             // Final html for the paragraph block
             html += listAwareHtml; // Use the list-aware HTML

             currentParagraph = []; // Reset paragraph buffer
        }
    };

    lines.forEach(line => {
        // Check for lines that exactly match "' :", "':", "' : '", etc. and ignore them ---
        // Also explicitly ignore lines that are just single quotes or brackets (malformed markers)
        if (line.trim().match(/^['\[\]]\s*$/) || line.trim().match(/^'\s*:\s*'*\s*$/)) {
             processParagraph(); // Finish any ongoing paragraph before skipping
             return; // Skip this line entirely
        }

        // Check for Title format: [Text] - Must match the pattern strictly
        // Use original line to preserve potential leading/trailing spaces in API response for matching
        const titleMatch = line.match(/^\[([^\]]+)\]\s*$/);
        if (titleMatch) {
            processParagraph(); // Finish previous paragraph
            const title = titleMatch[1].trim(); // Extract text inside brackets and trim

            if (!firstTitleProcessed) {
                 // Only format the very first [] line as h2
                 let formattedTitle = title.replace(/\^([^^\n]+)\^/g, '<strong>$1</strong>');
                 formattedTitle = formattedTitle.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>'); // Fallback bold
                 html += `<h2>${formattedTitle}</h2>`; // Use h2 for the first title
                firstTitleProcessed = true;
                // DO NOT add this line to currentParagraph, as it's a title element.
            } else {
                 // Subsequent [] lines should theoretically not happen based on the prompt,
                 // but if they do, treat them as subtitles for robustness.
                 let formattedSubtitle = title.replace(/\^([^^\n]+)\^/g, '<strong>$1</strong>');
                 formattedSubtitle = formattedSubtitle.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>'); // Fallback bold
                 html += `<h3>${formattedSubtitle}</h3>`; // Use h3 for subsequent titles
                 // DO NOT add this line to currentParagraph.
             }
             return; // Consume this line as a title/subtitle and move to the next
        }

        // Check for Subtitle format: 'Text' - Must match the pattern strictly
        // Use original line for matching
         const subtitleMatch = line.match(/^'([^']+)'\s*$/);
        if (subtitleMatch) {
            processParagraph(); // Finish previous paragraph
            const subtitle = subtitleMatch[1].trim(); // Extract text inside single quotes and trim
             let formattedSubtitle = subtitle.replace(/\^([^^\n]+)\^/g, '<strong>$1</strong>');
             formattedSubtitle = formattedSubtitle.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>'); // Fallback bold
             html += `<h3>${formattedSubtitle}</h3>`; // Using h3 for subtitles
             // DO NOT add this line to currentParagraph.
             return; // Consume the subtitle and move to the next
        }

        // Check for empty lines to signify paragraph breaks
        else if (line.trim() === '') {
             processParagraph(); // Finish previous paragraph on empty line
             // DO NOT add this line to currentParagraph.
             return; // Consume the empty line and move to the next
        }
        // Otherwise, it's part of a regular paragraph
        else {
            currentParagraph.push(line); // Push the original line (including potential leading/trailing spaces)
        }
    });

    // Process any remaining paragraph content after the loop finishes
    processParagraph();


    // If no content was generated or parsed into HTML elements
    // Check if html is empty BUT the original text wasn't empty or just loading/error messages
    const isEmptyGeneratedContent = html.trim() === '';
    // Regex to check if the text contains ONLY loading/error messages or known initial states
     const isOnlyInitialOrError = (text.trim().includes(translations['es']?.campaign_output_initial_message || 'Press [Generate Campaign] to start') ||
                                 text.trim().includes(translations['en']?.campaign_output_initial_message || 'Press [Generate Campaign] to start') ||
                                 text.trim().includes(translations['es']?.campaign_output_loading || 'Loading...') ||
                                 text.trim().includes(translations['en']?.campaign_output_loading || 'Loading...') ||
                                  text.trim().includes(translations['es']?.error_message_prefix || 'Error generating content.') ||
                                  text.trim().includes(translations['en']?.error_message_prefix || 'Error generating content.') ||
                                  text.trim().includes(translations['es']?.saved_character_initial_message || 'Select a character from the list above.') ||
                                  text.trim().includes(translations['en']?.saved_character_initial_message || 'Select a character from the list above.') ||
                                   text.trim().includes(translations['es']?.saved_campaign_initial_message || 'Select a campaign from the list above.') ||
                                  text.trim().includes(translations['en']?.saved_campaign_initial_message || 'Select a campaign from the list above.')
                                 );


    const isOriginalTextMeaningful = text.trim() !== '' && !isOnlyInitialOrError;


    if (isEmptyGeneratedContent && isOriginalTextMeaningful) {
        const currentLang = languageSelect.value;
        html = `
             <p class="error-message">
                 ${translations[currentLang]?.error_message_prefix || 'No content parsed correctly.'}
                 <br>${translations[currentLang]?.error_message_details_prefix || 'Details:'} API returned unparseable content.
                 <br>Raw text: <pre>${text.trim()}</pre>
             </p>`;
    } else if (html.trim() === '' && text.trim() === '') {
         // If raw text is empty, and html is empty, this might be a valid initial state
         // Or an error. Check if the target output element already contains a loading/initial message.
          const targetElement = (type === 'campaign') ? campaignOutput : characterOutput;

          // Check if the *current HTML content* of the target element is just one of the known initial/loading/saved messages
          const currentHtmlContent = targetElement.textContent.trim(); // Use textContent for checking messages
          const isCurrentHtmlInitialOrLoading = (allKnownCampaignMessages.includes(currentHtmlContent) && type === 'campaign') ||
                                                (allKnownCharacterMessages.includes(currentHtmlContent) && type === 'character');


          if (!isCurrentHtmlInitialOrLoading) {
             // If the current HTML is NOT just an initial/loading message, then empty text is an error.
             const currentLang = languageSelect.value;
             html = `
                  <p class="error-message">
                      ${translations[currentLang]?.error_message_prefix || 'Error generating content.'}
                      <br>${translations[currentLang]?.error_message_details_prefix || 'Details:'} API returned empty content.
                  </p>`;
          }
          // If it contains loading/initial, just return empty html, the existing message stays.
    }


    return html;
}


// --- Saved Character Functions ---

// Function to save saved characters to localStorage
function saveCharactersToLocalStorage() {
    localStorage.setItem('savedCharacters', JSON.stringify(savedCharacters));
}

// Function to save the current character
function saveCurrentCharacter() {
    const currentLang = languageSelect.value;
     // Check if there is valid raw text to save
     // Also check if the current content is just an initial message or error
    if (!lastGeneratedCharacterRawText ||
         characterOutput.querySelector('.loading-message') ||
         characterOutput.querySelector('.error-message')) {
        alert(translations[currentLang]?.save_error_no_character || "No character to save. Generate one first.");
        return;
    }

    // Extract character name from the raw text
    // Use the formatTextOutput logic to find the first [Title] which should be the name
    // Use the same regex as in formatTextOutput for consistency
    const nameMatch = lastGeneratedCharacterRawText.match(/^\[([^\]]+)\]\s*$/m); // Use multiline flag and check full line pattern
    let characterName = nameMatch ? nameMatch[1].trim() : `${translations[currentLang]?.unnamed_character || 'Unnamed Character'} ${savedCharacters.length + 1}`;

    // Prevent saving duplicate names (simple check, could add timestamp/ID for uniqueness)
    let baseName = characterName;
    let counter = 1;
    let uniqueName = baseName;
    // Check against existing names, case-insensitive and trimmed
    while (savedCharacters.some(char => char.name.trim().toLowerCase() === uniqueName.trim().toLowerCase())) {
         counter++;
         uniqueName = `${baseName} (${counter})`;
    }
    characterName = uniqueName;


    // Create the character object
    const character = {
        name: characterName,
        html: formatTextOutput(lastGeneratedCharacterRawText, 'character') + // Format the raw text first
              (lastCharacterPrompt || lastGeneratedCampaignRawText ? // Add prompt note if applicable
                 `<p class="italic-prompt">
                     ${lastCharacterPrompt && lastGeneratedCampaignRawText ?
                     `<strong>${translations[currentLang]?.user_idea_considered_prefix || 'Idea Considered:'}</strong> "${lastCharacterPrompt}" ${translations[currentLang]?.user_idea_and_context_suffix || 'and based on the current campaign.'}` :
                     lastCharacterPrompt ?
                     `<strong>${translations[currentLang]?.user_idea_considered_prefix || 'Idea Considered:'}</strong> "${lastCharacterPrompt}" ${translations[currentLang]?.user_idea_only_suffix || ''}` :
                     lastGeneratedCampaignRawText ?
                     `<strong>${translations[currentLang]?.user_idea_considered_prefix || 'Idea Considered:'}</strong> ${translations[currentLang]?.context_only_suffix || 'Based on the current campaign.'}` : ''
                 }
                 </p>`
                 : '' // Empty string if no prompt or context
             ),
        rawText: lastGeneratedCharacterRawText, // Save the raw text for potential future use
        prompt: lastCharacterPrompt, // Save the prompt used for generation
        timestamp: Date.now() // Optional: add a timestamp
    };

    // Add the character to the array
    savedCharacters.push(character);

    // Save to localStorage
    saveCharactersToLocalStorage();

    // Render the updated tabs
    renderSavedCharacterTabs();

    // Display the newly saved character - this will automatically activate its tab
    displaySavedCharacter(savedCharacters.length - 1);

    // Provide feedback
    console.log(translations[currentLang]?.save_success_character + characterName);
}

// Function to delete a saved character
function deleteCharacter(index) {
     const currentLang = languageSelect.value;
     if (index < 0 || index >= savedCharacters.length) {
         console.error("Invalid index for character deletion:", index);
         return;
     }

     const characterName = savedCharacters[index].name;
     if (confirm(`${translations[currentLang]?.delete_confirm_character || 'Are you sure you want to delete '}"${characterName}"?`)) {
         // Check if the character being deleted is currently displayed
         const activeTab = savedCharacterTabs.querySelector('.saved-item-tab-container button.saved-item-tab.active');
         const currentDisplayedCharacterIndex = activeTab ? parseInt(activeTab.getAttribute('data-index'), 10) : -1;
         const isCurrentlyDisplayed = currentDisplayedCharacterIndex === index;


         savedCharacters.splice(index, 1);
         saveCharactersToLocalStorage();
         renderSavedCharacterTabs();

         // If the deleted character was active, determine what to display next
         if (isCurrentlyDisplayed) {
             if (savedCharacters.length > 0) {
                 // Display the character that is now at the deleted index's position
                 // This is index 0 if the first item was deleted, otherwise it's the item
                 // that shifted up. The correct index is still 'index' relative to the
                 // list *before* deletion, but we need to show the item at the *new* index.
                 // Displaying the first character (index 0) is simpler and predictable.
                 displaySavedCharacter(0); // Display the first character in the new list
             } else {
                 // If the list is now empty, show the default character generation message
                 characterOutput.innerHTML = `<p class="loading-message" data-i18n="character_output_initial_message">${translations[currentLang]?.character_output_initial_message || 'Press [Generate Character] to start'}</p>`;
                  // Clear prompt note placeholder as no character is displayed
                 lastCharacterPrompt = '';
                 lastGeneratedCharacterRawText = '';
             }
         }
         // If a different character was active, no change is needed in characterOutput,
         // renderSavedCharacterTabs will handle removing the deleted tab.
     }
}


// Function to render the tabs for saved characters
function renderSavedCharacterTabs() {
    // Clear existing tabs
    savedCharacterTabs.innerHTML = '';

    const currentLang = languageSelect.value;

    // Create a button for each saved character
    savedCharacters.forEach((character, index) => {
        const tabButton = document.createElement('button');
        tabButton.classList.add('saved-item-tab'); // Use unified class
        tabButton.textContent = character.name;
        tabButton.setAttribute('data-index', index); // Store the index

        // Add event listener to display the character on click
        tabButton.addEventListener('click', () => {
            displaySavedCharacter(index);
        });

        // Add a delete button/icon
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-item-button'); // Use unified class
        deleteButton.textContent = translations[currentLang]?.delete_character_button || 'X'; // 'X' or translated delete text
        deleteButton.title = `${translations[currentLang]?.delete_confirm_character || 'Delete '}"${character.name}"`; // Tooltip
        deleteButton.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent the tab click event from firing
            deleteCharacter(index);
        });

        const tabContainer = document.createElement('div');
        tabContainer.classList.add('saved-item-tab-container'); // Container for tab text and delete button
        tabContainer.appendChild(tabButton);
        tabContainer.appendChild(deleteButton);


        savedCharacterTabs.appendChild(tabContainer);
    });

    // After rendering, check if any tab should be active (e.g., if the first character is being displayed on load)
    // This is handled by displaySavedCharacter being called after save or on load if characters exist.
}

// Function to display a specific saved character
function displaySavedCharacter(index) {
    // Ensure the index is valid
    if (index < 0 || index >= savedCharacters.length) {
        console.error("Invalid saved character index:", index);
         const currentLang = languageSelect.value;
         if (savedCharacters.length > 0) {
            // If index is invalid but characters exist, default to displaying the first one
             displaySavedCharacter(0);
         } else {
             // If no characters exist, show the initial message
              characterOutput.innerHTML = `<p class="loading-message" data-i18n="character_output_initial_message">${translations[currentLang]?.character_output_initial_message || 'Press [Generate Character] to start'}</p>`;
             // Clear prompt note placeholder as no character is displayed
             lastCharacterPrompt = '';
             lastGeneratedCharacterRawText = '';
              // Remove active state from all tabs
             const tabs = savedCharacterTabs.querySelectorAll('.saved-item-tab-container button.saved-item-tab');
             tabs.forEach(tab => tab.classList.remove('active'));
         }

        return;
    }

    const character = savedCharacters[index];

    // Set the display area's HTML content (using characterOutput)
    // The HTML stored in the character object already includes the formatted text and prompt note
    characterOutput.innerHTML = character.html;

    // Update active state for tabs
    const tabs = savedCharacterTabs.querySelectorAll('.saved-item-tab-container button.saved-item-tab');
    tabs.forEach((tab) => {
        // Find the correct tab button based on its data-index attribute
        const tabIndexAttr = parseInt(tab.getAttribute('data-index'), 10);
        if (tabIndexAttr === index) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });

    // Update last generated raw text and prompt to match the displayed saved character
    // This is important so saving the *same* character again doesn't re-generate it or mess up the data.
    lastGeneratedCharacterRawText = character.rawText;
    lastCharacterPrompt = character.prompt;

    // Note: When displaying a saved character, the prompt note is part of its saved HTML.
    // The prompt note is updated when the language changes via the setLanguage -> displaySavedCharacter call.
}


// --- Saved Campaign Functions (Copied and adapted from Character functions) ---

// Function to save saved campaigns to localStorage
function saveCampaignsToLocalStorage() {
    localStorage.setItem('savedCampaigns', JSON.stringify(savedCampaigns));
}

// Function to save the current campaign
function saveCurrentCampaign() {
    const currentLang = languageSelect.value;
     // Check if there is valid raw text to save
     // Also check if the current content is just an initial message or error
    if (!lastGeneratedCampaignRawText ||
         campaignOutput.querySelector('.loading-message') ||
         campaignOutput.querySelector('.error-message')) {
        alert(translations[currentLang]?.save_error_no_campaign || "No campaign to save. Generate one first.");
        return;
    }

    // Extract campaign name from the raw text
    // Use the formatTextOutput logic to find the first [Title] which should be the name
    // Use the same regex as in formatTextOutput for consistency
    const nameMatch = lastGeneratedCampaignRawText.match(/^\[([^\]]+)\]\s*$/m); // Use multiline flag and check full line pattern
    let campaignName = nameMatch ? nameMatch[1].trim() : `${translations[currentLang]?.unnamed_campaign || 'Unnamed Campaign'} ${savedCampaigns.length + 1}`;

    // Prevent saving duplicate names
    let baseName = campaignName;
    let counter = 1;
    let uniqueName = baseName;
    // Check against existing names, case-insensitive and trimmed
    while (savedCampaigns.some(campaign => campaign.name.trim().toLowerCase() === uniqueName.trim().toLowerCase())) {
         counter++;
         uniqueName = `${baseName} (${counter})`;
    }
    campaignName = uniqueName;


    // Create the campaign object
    const campaign = {
        name: campaignName,
        html: formatTextOutput(lastGeneratedCampaignRawText, 'campaign') + // Format the raw text first
              (lastCampaignPrompt ? // Add prompt note if a prompt was used
                 `<p class="italic-prompt">
                     <strong>${translations[currentLang]?.user_idea_considered_prefix || 'Idea Considered:'}</strong> "${lastCampaignPrompt}"
                 </p>`
                 : '' // Empty string if no prompt
             ),
        rawText: lastGeneratedCampaignRawText, // Save the raw text for potential future use
        prompt: lastCampaignPrompt, // Save the prompt used for generation
        timestamp: Date.now() // Optional: add a timestamp
    };

    // Add the campaign to the array
    savedCampaigns.push(campaign);

    // Save to localStorage
    saveCampaignsToLocalStorage();

    // Render the updated tabs
    renderSavedCampaignTabs();

    // Display the newly saved campaign - this will automatically activate its tab
    displaySavedCampaign(savedCampaigns.length - 1);

    // Provide feedback
    console.log(translations[currentLang]?.save_success_campaign + campaignName);
}

// Function to delete a saved campaign
function deleteCampaign(index) {
     const currentLang = languageSelect.value;
     if (index < 0 || index >= savedCampaigns.length) {
         console.error("Invalid index for campaign deletion:", index);
         return;
     }

     const campaignName = savedCampaigns[index].name;
     if (confirm(`${translations[currentLang]?.delete_confirm_campaign || 'Are you sure you want to delete campaign '}"${campaignName}"?`)) {
         // Check if the campaign being deleted is currently displayed
         const activeTab = savedCampaignTabs.querySelector('.saved-item-tab-container button.saved-item-tab.active');
         const currentDisplayedCampaignIndex = activeTab ? parseInt(activeTab.getAttribute('data-index'), 10) : -1;
         const isCurrentlyDisplayed = currentDisplayedCampaignIndex === index;


         savedCampaigns.splice(index, 1);
         saveCampaignsToLocalStorage();
         renderSavedCampaignTabs();

         // If the deleted campaign was active, determine what to display next
         if (isCurrentlyDisplayed) {
             if (savedCampaigns.length > 0) {
                 // Display the campaign that is now at the deleted index's position
                 displaySavedCampaign(0); // Display the first campaign in the new list
             } else {
                 // If the list is now empty, show the default campaign generation message
                 campaignOutput.innerHTML = `<p class="loading-message" data-i18n="campaign_output_initial_message">${translations[currentLang]?.campaign_output_initial_message || 'Press [Generate Campaign] to start'}</p>`;
                 // Clear prompt note placeholder as no campaign is displayed
                 lastCampaignPrompt = '';
                 lastGeneratedCampaignRawText = ''; // Also clear raw text
             }
         }
         // If a different campaign was active, no change is needed in campaignOutput,
         // renderSavedCampaignTabs will handle removing the deleted tab.
     }
}


// Function to render the tabs for saved campaigns
function renderSavedCampaignTabs() {
    // Clear existing tabs
    savedCampaignTabs.innerHTML = '';

    const currentLang = languageSelect.value;

    // Create a button for each saved campaign
    savedCampaigns.forEach((campaign, index) => {
        const tabButton = document.createElement('button');
        tabButton.classList.add('saved-item-tab'); // Use unified class
        tabButton.textContent = campaign.name;
        tabButton.setAttribute('data-index', index); // Store the index

        // Add event listener to display the campaign on click
        tabButton.addEventListener('click', () => {
            displaySavedCampaign(index);
        });

        // Add a delete button/icon
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-item-button'); // Use unified class
        deleteButton.textContent = translations[currentLang]?.delete_campaign_button || 'X'; // 'X' or translated delete text
        deleteButton.title = `${translations[currentLang]?.delete_confirm_campaign || 'Delete campaign '}"${campaign.name}"`; // Tooltip
        deleteButton.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent the tab click event from firing
            deleteCampaign(index);
        });

        const tabContainer = document.createElement('div');
        tabContainer.classList.add('saved-item-tab-container'); // Container for tab text and delete button
        tabContainer.appendChild(tabButton);
        tabContainer.appendChild(deleteButton);


        savedCampaignTabs.appendChild(tabContainer);
    });

    // After rendering, check if any tab should be active (e.g., if the first campaign is being displayed on load)
    // This is handled by displaySavedCampaign being called after save or on load if campaigns exist.
}

// Function to display a specific saved campaign
function displaySavedCampaign(index) {
    // Ensure the index is valid
    if (index < 0 || index >= savedCampaigns.length) {
        console.error("Invalid saved campaign index:", index);
         const currentLang = languageSelect.value;
         if (savedCampaigns.length > 0) {
             // If index is invalid but campaigns exist, default to displaying the first one
             displaySavedCampaign(0);
         } else {
             // If no campaigns exist, show the initial message
              campaignOutput.innerHTML = `<p class="loading-message" data-i18n="campaign_output_initial_message">${translations[currentLang]?.campaign_output_initial_message || 'Press [Generate Campaign] to start'}</p>`;
             // Clear prompt note placeholder as no campaign is displayed
             lastCampaignPrompt = '';
             lastGeneratedCampaignRawText = ''; // Also clear raw text
              // Remove active state from all tabs
             const tabs = savedCampaignTabs.querySelectorAll('.saved-item-tab-container button.saved-item-tab');
             tabs.forEach(tab => tab.classList.remove('active'));
         }

        return;
    }

    const campaign = savedCampaigns[index];

    // Set the display area's HTML content (using campaignOutput)
    // The HTML stored in the campaign object already includes the formatted text and prompt note
    campaignOutput.innerHTML = campaign.html;

    // Update active state for tabs
    const tabs = savedCampaignTabs.querySelectorAll('.saved-item-tab-container button.saved-item-tab');
    tabs.forEach((tab) => {
        // Find the correct tab button based on its data-index attribute
        const tabIndexAttr = parseInt(tab.getAttribute('data-index'), 10);
        if (tabIndexAttr === index) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });

    // Update last generated raw text and prompt to match the displayed saved campaign
    // This is important so character generation can use the correct campaign context,
    // and saving the *same* campaign again doesn't re-generate it or mess up the data.
    lastGeneratedCampaignRawText = campaign.rawText;
    lastCampaignPrompt = campaign.prompt;

    // Note: When displaying a saved campaign, the prompt note is part of its saved HTML.
    // The prompt note is updated when the language changes via the setLanguage -> displaySavedCampaign call.
}


generateBtn.addEventListener('click', generateCampaign);
generateCharacterBtn.addEventListener('click', generateCharacter); // Add event listener for the new button
saveCurrentCharacterBtn.addEventListener('click', saveCurrentCharacter); // Add event listener for the save button
saveCurrentCampaignBtn.addEventListener('click', saveCurrentCampaign); // Add event listener for the save campaign button
