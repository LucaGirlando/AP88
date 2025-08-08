import streamlit as st
import random
from collections import defaultdict
import os
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from PIL import Image

config_path = os.path.expanduser("~/.streamlit/config.toml")
os.makedirs(os.path.dirname(config_path), exist_ok=True)

with open(config_path, "w") as f:
    f.write("[theme]\nbase='dark'\n")

# ============================================
# CONFIGURAZIONE INIZIALE
# ============================================
st.set_page_config(
    page_title="AP88",
    page_icon="🚀",
    layout="wide",
    initial_sidebar_state="expanded",
    theme.base=="dark"  
)

# ============================================
# CSS PREMIUM
# ============================================
st.markdown("""
<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700&family=Playfair+Display:wght@400;600&display=swap');

:root {
    --primary: #121212;
    --secondary: #1e1e1e;
    --accent: #6a5acd;  /* Slate blue */
    --accent-light: #9370db;
    --accent-dark: #483d8b;
    --text: #f8f8f8;
    --text-secondary: #c0c0c0;
    --border: #3a3a3a;
    --card-bg: #252525;
    --success: #4caf50;
    --error: #f44336;
    --transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

html, body, .stApp {
    background-color: #121212 !important;
    color: #f8f8f8 !important;
}
            
* {
    font-family: 'Montserrat', sans-serif;
}

.stApp {
    background-color: var(--primary) !important;
    color: var(--text) !important;
    background-image: radial-gradient(circle at 25% 25%, rgba(106, 90, 205, 0.1) 0%, transparent 50%);
}

[data-testid="stSidebar"] {
    background-color: var(--secondary) !important;
    border-right: 1px solid var(--border) !important;
    backdrop-filter: blur(8px);
}

h1, h2, h3, h4 {
    font-family: 'Playfair Display', serif;
    font-weight: 600;
    margin-bottom: 1rem;
}

h1 {
    font-size: 3rem;
    background: linear-gradient(135deg, var(--accent) 0%, var(--accent-light) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 0 2px 10px rgba(106, 90, 205, 0.2);
    position: relative;
    display: inline-block;
}

h1::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, var(--accent), transparent);
}

h2 {
    font-size: 2rem;
    color: var(--text) !important;
    position: relative;
    padding-bottom: 0.5rem;
}

h2::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 50px;
    height: 3px;
    background: var(--accent);
}

h3 {
    font-size: 1.5rem;
    color: var(--accent-light) !important;
}

.game-container {
    padding: 2.5rem;
    margin: 1.5rem 0;
    border-radius: 16px;
    border: 1px solid var(--border);
    background-color: var(--card-bg);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    transition: var(--transition);
    position: relative;
    overflow: hidden;
}

.game-container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: linear-gradient(to bottom, var(--accent), var(--accent-light));
}

.game-container:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(106, 90, 205, 0.3);
}

.stButton>button {
    background: linear-gradient(135deg, var(--accent) 0%, var(--accent-light) 100%) !important;
    color: white !important;
    border: none !important;
    border-radius: 12px !important;
    padding: 0.8rem 2rem !important;
    font-weight: 600 !important;
    transition: var(--transition) !important;
    box-shadow: 0 4px 15px rgba(106, 90, 205, 0.4) !important;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.stButton>button:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(106, 90, 205, 0.5) !important;
}

.stButton>button:active {
    transform: translateY(1px);
}

.login-container {
    max-width: 500px;
    margin: 5rem auto;
    padding: 3rem;
    border-radius: 24px;
    text-align: center;
    background-color: var(--card-bg);
    border: 1px solid var(--border);
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.3);
    position: relative;
    overflow: hidden;
}

.login-container::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(106, 90, 205, 0.1) 0%, transparent 70%);
    animation: rotate 20s linear infinite;
    z-index: 0;
}

@keyframes rotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.login-container > * {
    position: relative;
    z-index: 1;
}

.password-hint {
    color: var(--text-secondary);
    font-size: 0.9rem;
    margin-top: 0.5rem;
    font-style: italic;
}

/* Radio buttons eleganti */
.stRadio > div {
    flex-direction: column;
    gap: 0.8rem;
}

.stRadio > div > label {
    padding: 1rem;
    border-radius: 12px;
    border: 1px solid var(--border);
    transition: var(--transition);
    background-color: var(--card-bg);
}

.stRadio > div > label:hover {
    border-color: var(--accent);
    transform: translateX(5px);
}

.stRadio > div > label[data-baseweb="radio"] > div:first-child {
    margin-right: 1rem;
}

/* Divider personalizzato */
.stMarkdown hr {
    border: none;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--accent), transparent);
    margin: 2rem 0;
}

/* Effetti di focus per input */
.stTextInput input:focus, .stTextArea textarea:focus {
    border-color: var(--accent) !important;
    box-shadow: 0 0 0 2px rgba(106, 90, 205, 0.2) !important;
}

/* Animazione di pulsazione per il logo */
@keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
}

.logo-container {
    animation: pulse 4s ease-in-out infinite;
}

/* Tooltip eleganti */
[data-baseweb="tooltip"] {
    background-color: var(--card-bg) !important;
    border: 1px solid var(--border) !important;
    color: var(--text) !important;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3) !important;
    border-radius: 8px !important;
}
</style>
""", unsafe_allow_html=True)

# ============================================
# AUTENTICAZIONE MIGLIORATA
# ============================================
def check_password():
    def password_entered():
        if st.session_state["password"].strip() == "Dario Lampa":
            st.session_state["password_correct"] = True
            st.session_state["sidebar_state"] = "expanded"
            del st.session_state["password"]
        else:
            st.session_state["password_correct"] = False
            st.session_state["show_hint"] = True

    if "password_correct" not in st.session_state or not st.session_state["password_correct"]:
        with st.container():
            st.markdown("""
            <div class="login-container">
                <h2>🔒 Accesso Riservato AP88</h2>
                <p style="margin-bottom: 2rem;">Inserisci la password per continuare</p>
                <p style="margin-bottom: 2rem;"> Utilizzate il Computer (Dark theme consigliato)</p>
            """, unsafe_allow_html=True)
            
            st.text_input(
                "Password",
                type="password",
                on_change=password_entered,
                key="password",
                label_visibility="collapsed",
                placeholder="Inserisci la password"
            )
            
            st.markdown("""
            <div class="password-hint">
                Suggerimento: Soprannome di chi ha preso il voto più alto nella pagella della Sardegna
            </div>
            """, unsafe_allow_html=True)
            
            if "password_correct" in st.session_state and not st.session_state["password_correct"]:
                st.error("Password errata. Riprova.")
            
            st.markdown("</div>", unsafe_allow_html=True)
            st.stop()

    if st.session_state.get("sidebar_state") == "expanded":
        st.query_params.update(sidebar="expanded")

check_password()

# ============================================
# PAGINE
# ============================================
def home_page():
    st.title("AP88")
    st.markdown("""
    <div style="color: var(--text-secondary); margin-bottom: 3rem; line-height: 1.7; font-size: 1.1rem;">
        Benvenuti nell'archivio ufficiale del gruppo AP88. Qui troverete tutte le pagelle delle nostre vacanze
        e le statistiche storiche dei membri del gruppo.
    </div>
    """, unsafe_allow_html=True)

    # Sezione Pagelle Complete
    with st.expander("📜 ARCHIVIO PAGELLE COMPLETE", expanded=True):
        tabs = st.tabs(["🇮🇹 Sardegna 2021", "🇬🇷 Corfù 2022", "🇮🇹 Puglia 2023", "🇭🇷 Croazia 2024", "🇪🇸 Barcellona 2024/25"])
        
        with tabs[0]:  # Sardegna 2021
                col1, col2 = st.columns([1, 2])
                with col1:
                        st.markdown("""
                        <div style="background: rgba(106, 90, 205, 0.1); padding: 1.5rem; border-radius: 12px;">
                            <h4 style="color: var(--accent); margin-bottom: 1rem;">📊 Statistiche</h4>
                            <p><strong>Voto Medio:</strong> 8.3</p>
                            <p><strong>Top Voto:</strong> 10 (Trave)</p>
                            <p><strong>Partecipanti:</strong> 11</p>
                            <p><strong>Durata:</strong> 7 giorni</p>
                            <p><strong>Luogo:</strong> San Teodoro, Sardegna</p>
                        </div>
                        """, unsafe_allow_html=True)
                with col2:
                        st.markdown("""
                        <h3>Trave (DARIO LAMPA): 10</h3>
                        <p>Regala spettacolo ai tifosi ogni giorno, gioca con una tranquillità da vero campione; calmo come il mare in sardegna con il maestrale. Gli dedicano una via a san teodoro dopo il tentato omicidio di girla e le casse di birra facendo manovra.</p>
                        """, unsafe_allow_html=True)

                        st.markdown("""
                        <h3>Miglio (THE MASK): 9</h3>
                        <p>9 come i chili persi sboccando come un vulcano. Insieme a girla guida la wave del risparmio e torna a casa in positivo di 25 centesimi.</p>
                        """, unsafe_allow_html=True)

                        st.markdown("""
                        <h3>Ari (BULBASAUR): 7.5</h3>
                        <p>Qualche snitchata di troppo le fa crescere le treccine colorate alla 69. Quando non dorme è simpatica come quelli delle prevendite in spiaggia.</p>
                        """, unsafe_allow_html=True)

                        st.markdown("""
                        <h3>Ceci (@JACOGILA): 8</h3>
                        <p>C'è un po' di ceci in questo jacopo; il suo apparecchio puzza come l'acqua di porto ottiolu, in casa è utile come l'ombrellone con 50 km/h di vento. Mezzo voto in più per la scopata sul letto di trave.</p>
                        """, unsafe_allow_html=True)

                        st.markdown("""
                        <h3>Paga (ER FREGOLA): 8</h3>
                        <p>Mangia di notte carciofini e funghi a non finire. Il pagafigometro è alle stelle ma si esaurisce in una sola poppata con la marti. Sforna più nuggets del MC ma non viene assunto per mancanza di laurea.</p>
                        """, unsafe_allow_html=True)

                        st.markdown("""
                        <h3>Chiara (LO GNOCCO): 8+</h3>
                        <p>Sta ancora cercando il computer per vedere le olimpiadi. Alterna lamentele ad ordini con picchi di altruismo saltuari. È ancora a porto rotondo ad aspettare gli spaghetti alle vongole.</p>
                        """, unsafe_allow_html=True)

                        st.markdown("""
                        <h3>Bax (NICKI LAUDA): 8.5</h3>
                        <p>Recupera in fretta dall'infortunio per esserci e guidare la squadra con la sua puma infuocata. Non vuole i soldi della cauzione perché non è un poveraccio. Mezzo punto in meno per il gommone rotto.</p>
                        """, unsafe_allow_html=True)

                        st.markdown("""
                        <h3>Gaia (LA LAVASTOVIGLIE): 7.5</h3>
                        <p>Cauzione a rischio per il bicchiere rotto; è un'amante delle spiagge sconosciute. Difficilmente ha gli occhi aperti dopo il tramonto ma recupera in cucina.</p>
                        """, unsafe_allow_html=True)

                        st.markdown("""
                        <h3>Auro e Gio (LUNATICHE): 7.5</h3>
                        <p>Incollate come gemelli siamesi, si completano a vicenda una aumentando il numero di canne giornaliere e l'altra iniziando a tatuarsi.</p>
                        """, unsafe_allow_html=True)

                        st.markdown("""
                        <h3>Paci (SARDO VERO: EJA): 8</h3>
                        <p>Conclude il suo mese di permanenza raggiungendo quasi la cittadinanza onoraria, festeggia la settimana da fidanzato non nel migliore dei modi, ma a tutti gli effetti risultata il miglior cagatore e il mastro cannaiolo.</p>
                        """, unsafe_allow_html=True)

                        st.markdown("""
                        <h3>Girla (IL T-REX): 9</h3>
                        <p>Crea grossi meme per tutta la vacanza, si riscopre artista, ma resta umile rimanendo l'uomo del filtro, tranne la sera di san Lorenzo nella quale si improvvisa tiratore scelto. Batte miglio tornando in positivo di 26 centesimi.</p>
                        """, unsafe_allow_html=True)

        with tabs[1]:  # Corfù 2022
                col1, col2 = st.columns([1, 2])
                with col1:
                        st.markdown("""
                        <div style="background: rgba(106, 90, 205, 0.1); padding: 1.5rem; border-radius: 12px;">
                            <h4 style="color: var(--accent); margin-bottom: 1rem;">📊 Statistiche</h4>
                            <p><strong>Voto Medio:</strong> 8.7</p>
                            <p><strong>Top Voto:</strong> 9.5 (Paga)</p>
                            <p><strong>Partecipanti:</strong> 9</p>
                            <p><strong>Durata:</strong> 8 giorni</p>
                            <p><strong>Luogo:</strong> Corfù, Grecia</p>
                        </div>
                        """, unsafe_allow_html=True)
                with col2:
                        st.markdown("""
                        <div class="game-container" style="padding: 1.5rem;">
                        """, unsafe_allow_html=True)

                        st.markdown("""
                        <h3>Trave (IL TIKTOKER): 9</h3>
                        <p>Entusiasmo alle stelle per lui, riesce a svincolarsi a parametro zero prima della partenza e parla con ogni essere vivente con i capelli mediamente lunghi improvvisandosi Nikola Greku. Dopo serate di riscaldamento l'ultima sera si presenta sul dischetto e non sbaglia. Un punto in più per aver rinunciato ad albume e minchiate proteiche.</p>
                        """, unsafe_allow_html=True)

                        st.markdown("""
                        <h3>Ari (LA CAMIONISTA): 8</h3>
                        <p>Situazione sentimentale inizialmente in dubbio ma chiarita appena in tempo e questo fa sì che passi una settimana mediamente tranquilla, esibendosi in uscite come vaffanculo, cazzo e porca troia a greci che però l'italiano lo capiscono. Non resiste più di due minuti senza parlare di sesso e in quei due minuti parla di Giulio. Nonostante l'infortunio nel finale non rinuncia al suo pacchetto di heets giornaliero a 4€.</p>
                        """, unsafe_allow_html=True)

                        st.markdown("""
                        <h3>Ceci (THE WEEKEND): 8</h3>
                        <p>C'è un po' di ceci in questo... Di giorno pacata e amichevole e di notte a tratti difficile da controllare. Nelle due sere al Montecristo si sbronza pesantemente da un momento all'altro senza che nessuno capisca come e quando sia successo. Appena sente blinding lights diventa più piccante del spicy cheese avli sauce. Un ringraziamento a jaki per il passaggio (poverino). Ps non prestatele i calzini.</p>
                        """, unsafe_allow_html=True)

                        st.markdown("""
                        <h3>Chiara (BIG ROM): 8+</h3>
                        <p>Parte con la squadra nonostante un po' di influenza per il precampionato alzando un po' troppo il gomito la sera, dando spettacolo pisciando in mare come mamma l'ha fatta. L'acqua sicuramente non regge il confronto con Milano Marittima però una o due spiagge si sono salvate. Negli ultimi giorni di mercato un trasferimento inaspettato la porta A LLORET DE MAR. Entro, infetto, esco, ciao.</p>
                        """, unsafe_allow_html=True)

                        st.markdown("""
                        <h3>Bax (IL PENGWIN): 9-</h3>
                        <p>Dopo la buona prestazione dell'anno scorso si riconferma pilota, prova a scaldare le gomme dietro la safety car innescando le ire dei maranza greci. Scommette il patrimonio familiare con girla puntando su Paci. Se non ti sveglia con la musica techno la mattina sicuro chiederà "chi ha bevuto l'acqua stanotte?"</p>
                        """, unsafe_allow_html=True)

                        st.markdown("""
                        <h3>Paga (IL BARISTA): 9.5</h3>
                        <p>Paga di più i voli perché deve imbarcare il boa in stiva e le ragazze a cui ha preparato il caffè lo sanno bene. Passa ogni alba a cavalcioni sulla terrazza facendo catcalling e quando funziona gli tocca giocare coi tacchetti a 6 nel pantano (meglio non girare il materasso). Vive di rendita dalle pentole pulite il primo giorno. Ci ricorda che: Abbiamo casa a 3 minuti a piedi dal Montecristo.</p>
                        """, unsafe_allow_html=True)

                        st.markdown("""
                        <h3>Girla (PITA ADVISOR): 8.5</h3>
                        <p>Gestisce l'economia della casa e della vacanza chiudendo come previsto con il bilancio migliore tra tutti. È MOLTO attento alla pulizia dopo le due settimane di convivenza con letizia ad eccezione del pigiama che lo usa ancora sporco. L'ultima sera regala spettacolo facendo capire ad ari che non è il suo tipo e rischia la rissa quando gli viene chiesto 1€ di mancia. Se volete mangiare una Pita sapete a chi chiedere.</p>
                        """, unsafe_allow_html=True)

                        st.markdown("""
                        <h3>Gaia (LA POETESSA): 9</h3>
                        <p>Grazie a qualche sostanza resiste sorprendentemente fino all'ultima sera dopo il tramonto, visita più grotte di Rocco Siffredi e delizia tutti con una grande massima che tradurremo dal latino nel seguente modo: "Sei mia e adesso ti infilo il pisello". PS: No cazzi dopo i pasti.</p>
                        """, unsafe_allow_html=True)

                        st.markdown("""
                        <h3>Paci (IL PADRINO): 9-</h3>
                        <p>Pronto per l'ennesima estate da single, ma sta volta da solo. Fiero del suo status, ma con ancora qualche strascico. Gli manca sempre la prima marcia, ma non cade nella tentazione dei roiti nucleari. Ultima sera maledetto da un vodoo greco. Mette in stand by la compagnia per una sera, causa: possiamo dire che "papà è tornato".</p>
                        """, unsafe_allow_html=True)

                        st.markdown("""
                        </div>
                        """, unsafe_allow_html=True)


        with tabs[2]:  # Puglia 2023
                col1, col2 = st.columns([1, 2])
                with col1:
                        st.markdown("""
                        <div style="background: rgba(106, 90, 205, 0.1); padding: 1.5rem; border-radius: 12px;">
                            <h4 style="color: var(--accent); margin-bottom: 1rem;">📊 Statistiche</h4>
                            <p><strong>Voto Medio:</strong> 8.4</p>
                            <p><strong>Top Voto:</strong> 9 (Girla, Ari)</p>
                            <p><strong>Partecipanti:</strong> 9</p>
                            <p><strong>Durata:</strong> 1 settimana</p>
                            <p><strong>Luogo:</strong> Puglia (Polignano, Gallipoli, Alezio, Alberobello, Ostuni)</p>
                        </div>
                        """, unsafe_allow_html=True)
                with col2:
                        st.markdown("""
                        <div class="game-container" style="padding: 1.5rem;">
                        """, unsafe_allow_html=True)

                        st.markdown("""
                        <h3>Girla (ANTHONY MARTIAL): 9</h3>
                        <p>Quest'anno viene contraddistinto dalla sua eleganza, dovuta all'utile generato in questo suo 2023, grazie al quale si imborghesisce e non indossa capi al di sotto del millino. Anche quest'anno non si smentisce nella creazione di meme (potrebbe tranquillamente essere l'admin di nonsonobellomaspaccio) però un problema fisico lo costringe ai box più di una volta. Nelle due serate fatte non si iscrive al tabellino dei marcatori per non ritrovarsi nella stessa situazione dell'Ucraina.</p>
                        """, unsafe_allow_html=True)

                        st.markdown("""
                        <h3>Ceci (LA CAFONA): 8.5</h3>
                        <p>Partendo dal presupposto che il duomo fa cagare perché ci sono i piccioni fuori, è importante evidenziare la tranquillità e i nervi saldi con cui gestisce la scelta della spiaggia la mattina dell'arrivo ad Alezio city, insistendo molto per andare in questo luogo sconosciuto detto Porto Cesareo. Purtroppo come navigatore non da il meglio di sè ma almeno permette alle girls di risparmiare una notte di affitto a Monopoli, facendole arrivare il giorno dopo con le sue indicazioni. Per il resto settimana tranquilla da tifosa della Juve, stressata quando qualcuno gli tocca la macchinetta del caffè e durante la festa per il compleanno di paletta.</p>
                        """, unsafe_allow_html=True)

                        st.markdown("""
                        <h3>Ari (LA RAGAZZA DI CICE): 9</h3>
                        <p>Un anno e mezzo dopo il successo greco riesce a bissare l'ottima prestazione con qualche pacca più forte e soprattutto qualche «vaffa» più generoso, oltre a qualche nuova canzone presa in prestito da francomarshall. Nonostante un fisico poco adatto riesce a vincere la sfida "chi arriva prima ai 1000m" e tiene un record stagionale di corse sulle gambe, che sicuramente porterà con sé fino all'anno prossimo. Nel frattempo si allena a fare i superpoteri con le mani.</p>
                        """, unsafe_allow_html=True)

                        st.markdown("""
                        <h3>Bax (IL PENGWIN): 8.5</h3>
                        <p>Nonostante la sua forma non sia al 100% riesce a mantenere un buon livello di gioco, anche grazie alle ottime condizioni meteo. Si dimostra un ottimo compagno di squadra e riesce a mantenere la calma anche nei momenti di difficoltà. Durante la settimana regala momenti di ilarità grazie ai suoi commenti pungenti e alle sue battute ironiche.</p>
                        """, unsafe_allow_html=True)

                        st.markdown("""
                        <h3>Gaia (LA POETESSA): 8.5</h3>
                        <p>Nonostante qualche piccolo problema di salute, riesce a partecipare attivamente alle attività del gruppo, offrendo il suo supporto e la sua presenza costante. La sua poesia e sensibilità emergono soprattutto nelle serate più tranquille, creando momenti di riflessione e relax per tutti.</p>
                        """, unsafe_allow_html=True)

                        st.markdown("""
                        <h3>Chiara (BIG ROM): 8</h3>
                        <p>Con il suo carattere deciso e la sua grinta, riesce a guidare il gruppo nelle situazioni più complesse. Nonostante qualche discussione, dimostra di essere una persona affidabile e pronta a dare il massimo. La sua energia è contagiosa e motiva tutti a dare il meglio.</p>
                        """, unsafe_allow_html=True)

                        st.markdown("""
                        <h3>Paga (IL BARISTA): 9</h3>
                        <p>Con la sua simpatia e il suo sorriso, riesce a creare un'atmosfera positiva e accogliente per tutti. Sempre pronto ad aiutare e a risolvere piccoli problemi, è una figura fondamentale all'interno del gruppo. La sua passione per il caffè non passa inosservata e diventa un momento di condivisione quotidiana.</p>
                        """, unsafe_allow_html=True)

                        st.markdown("""
                        <h3>Paci (IL PADRINO): 8.5</h3>
                        <p>Nonostante qualche momento di riflessione solitaria, riesce a mantenere un ruolo di leadership nel gruppo. La sua presenza è rassicurante e offre sempre consigli preziosi. La sua esperienza e saggezza sono apprezzate da tutti.</p>
                        """, unsafe_allow_html=True)

                        st.markdown("""
                        </div>
                        """, unsafe_allow_html=True)

        with tabs[3]:  # Croazia 2024
                col1, col2 = st.columns([1, 2])
                with col1:
                        st.markdown("""
                        <div style="background: rgba(106, 90, 205, 0.1); padding: 1.5rem; border-radius: 12px;">
                            <h4 style="color: var(--accent); margin-bottom: 1rem;">📊 Statistiche</h4>
                            <p><strong>Voto Medio:</strong> 8.6</p>
                            <p><strong>Top Voto:</strong> 19+ (Bax)</p>
                            <p><strong>Partecipanti:</strong> 7</p>
                            <p><strong>Durata:</strong> 9 giorni</p>
                            <p><strong>Luogo:</strong> Croazia (Dubrovnik, Split, Hvar, Bosnia)</p>
                        </div>
                        """, unsafe_allow_html=True)
                with col2:
                        st.markdown("""
                        <div class="game-container" style="padding: 1.5rem;">
                        """, unsafe_allow_html=True)

                        st.markdown("""
                        <h3>Il bimbo (MR DICK): 10-</h3>
                        <p>1,8km (0,9€) di pura follia, all'inizio viene preso con tante speranze, ma poi sostituito subito dai panardi della Lidl, finendo per diventare una mascotte. Inizia a macinare terreno venendo utilizzato come scarpetta per il sugo durante una cena circondati da gatti. Poi ci aiuta con un paio di panini alla nutella marcia durante le colazioni. E quando il suo compito sembrava finito, tanto da venir lanciato e preso a calci, stupisce tutti ed entra a gamba tesa nella penultima cena dei boys, carriandola totalmente dopo essersi fatto 20 minuti nel forno.</p>
                        """, unsafe_allow_html=True)

                        st.markdown("""
                        <h3>Bax (DELUX): 9+</h3>
                        <p>Per il quarto anno di fila si riconferma pilota, consuma un po' troppa benzina guidando come un pazzo e una volta, ascoltando Milano Testarossa, tenta la quadkill sui boys andando dritto ad una curva. Le sua giornata tipo è caratterizzata da: 3 ore di macchina con max 5 canzoni diverse, minimo una tappa alla Lidl/Plodine/Mumbaza, max 2 ore in spiaggia, guardare la stellata ogni sera (senza mai trovare Giove e Saturno). Il tutto viene sempre riportato a fine giornata a Maria che ormai è più informata di paga sulla croazia. Fa un po' da papà agli altri tre boys, inoltre quest'anno sostituisce il gioco dei nomi con qualsiasi gioco di carte possibile. -0.5 per il doppio passo del drink "offerto"a paga in disco.</p>
                        """, unsafe_allow_html=True)

                        st.markdown("""
                        <h3>Girla (EHI EWA, HAI PROGRAMMI STASERA?): 9</h3>
                        <p>Freschissimo di laurea ci sono grandi aspettative su di lui, dovute anche ad un aumento di budget dopo i recenti investimenti ben fatti. Illude tutti offrendo la cena a Spalato, ma in 0.0035 secondi finisce su Splitwise, facendo capire che la musica non è cambiata (come in macchina di Bax). In cucina però si esalta caramellando qualsiasi cosa assomigli ad una cipolla e in serata si cucina le 2005 finlandesi diffondendo il "Lesgoski". Il suo prime lo vive sicuramente in Bosnia dove grazie al cambio favorevole, vive due giorni in Black Friday che gli permettono di ordinare anche l'antipasto a cena. Verso fine vacanza si scopre che il suo grande miglioramento in inglese non è dovuto alle lezioni della Terzi ma a delle call con l'headquarter di Varsavia.</p>
                        """, unsafe_allow_html=True)

                        st.markdown("""
                        <h3>Paga (RIGATONI, NO FUSILLI): 9-</h3>
                        <p>Il re di Brisbane ha sulle spalle la responsabilità di aver prenotato 10 case, ottima quella "a 3 minuti da Dubrovnik" se non fosse che in mezzo c'è la dogana bosniaca con un'ora di coda ad ogni passaggio. Durante il viaggio itinerante ne organizza un altro per la settimana dopo, un po' per poppare in toscana e un po' per scroccare in Sarda e all'Elba. Prima che la Polo di Chiara partisse gli lascia un bel rigatone sopra, costringendo i boys a 5 giorni di stenti in attesa del preventivo per una portiera nuova, mentre lui muore le ultime due serate. -0,5 per i video home tour alla ciuccia toscana, ma +0,5 per gli shot offerti alle finlandesi per la squadra.</p>
                        """, unsafe_allow_html=True)

                        st.markdown("""
                        <h3>Paci (COLUI CHE LA SPIEGA): 8,5</h3>
                        <p>Partenza in salita per lui dopo il tentato omicidio da parte di Ari con l'aria condizionata [si si!] che gli ha causato un giorno di stop. In tutta la vacanza non tocca mai i fornelli e nemmeno il cazzo, per fortuna a Monza lo aspettano almeno quattro amiche 2010 della sorella. Durante tutta la vacanza si gasa per le storie di una tipa a Caso, peccato che l'ultimo giorno scoprirà essere la fidanzata di una famosa cantante Milanese (zona Duomo). Impossibile non fare acquisti scam ogni vacanza: 7€ di succo a bordo strada e 7€ di Puff in disco (girla non approva).</p>
                        """, unsafe_allow_html=True)

                        st.markdown("""
                        <h3>Ari (STANGA?MAGARI): 8-</h3>
                        <p>C'è un po' di Ari in questo Mattia. Per vendicarsi dei boys che hanno ordinato 10kg di carne in Bosnia gli attacca un bel virus prima di andarsene. Post laghi di Plitvice ha dei polpacci che manco @nicolòcereda01. Le partenze in salita non sono il suo forte ma non ha colpe sui danni causati alla Verpelli's Polo. Tenta l'omicidio su Paci alzando l'aria condizionata, ma purtroppo lo lascia solo oneshot. Nonostante il poco tempo passato al sole è riuscita ad abbronzarsi come Carlo Conti.</p>
                        """, unsafe_allow_html=True)

                        st.markdown("""
                        <h3>Chiara (AMMAN): 8</h3>
                        <p>Se l'acqua di Corfù era come quella di Milano Marittima, i paesaggi croati invece assomigliano molto alla Giordania (ancora da capire se ci sia andata). Se sali sulla sua macchina sei certo di vedere tutti i patrimoni Unesco ad ogni viaggio. Le sue speranze sono riposte nella cena di pesce dell'ultima sera, dove rimane delusa da un risotto alla milanese. Per il terzo anno di fila viene richiamata dal prestito, ma sta volta si porta dietro anche Ari. -0.5 per il solito part time, + 0.5 per aver messo la macchina.</p>
                        """, unsafe_allow_html=True)

                        st.markdown("""
                        </div>
                        """, unsafe_allow_html=True)


        with tabs[4]:  # Barcellona 2024/25
                col1, col2 = st.columns([1, 2])
                with col1:
                        st.markdown("""
                        <div style="background: rgba(106, 90, 205, 0.1); padding: 1.5rem; border-radius: 12px;">
                            <h4 style="color: var(--accent); margin-bottom: 1rem;">📊 Statistiche</h4>
                            <p><strong>Voto Medio:</strong> 9.2</p>
                            <p><strong>Top Voto:</strong> 10 (Marti)</p>
                            <p><strong>Partecipanti:</strong> 7</p>
                            <p><strong>Durata:</strong> 5 giorni</p>
                            <p><strong>Luogo:</strong> Barcellona, Spagna</p>
                        </div>
                        """, unsafe_allow_html=True)
                with col2:
                        st.markdown("""
                        <div class="game-container" style="padding: 1.5rem;">
                        """, unsafe_allow_html=True)

                        st.markdown("""
                        <h3>Ari (IN SMARTWORKING): 10</h3>
                        <p>Pagella d'onore nonostante la sua assenza, che però le ha fatto guadagnare punti infiniti come figlia. Fortunatamente per lei si trattava del primo capodanno low-cost non causando rimorsi dal punto di vista economico. Viene comunque aggiornata tramite videochiamata anche se averla dal vivo sarebbe stata tutt'altra cosa ❤.</p>
                        """, unsafe_allow_html=True)

                        st.markdown("""
                        <h3>Marti (L'INFLUENCER): 10</h3>
                        <p>Fresca di firma sul contratto è costretta a stamparsi un sorriso in faccia per non fare brutta figura con gli amici del fidanzato. Un po' provata ancora dal recente cambio di telefono che l'ha costretta a ritrovarsi con l'iphone 16, non nasconde comunque la sue doti da boomer ben visibili ai suoi follower. Prepara la squadra alla serata principale infilando scorte di alcol in tutti gli orifizi dei compagni risultate utilissime ad allungare il ghiaccio nei bicchieri vuoti. L'ultima sera ospita un hamburgerata importante mantendendo la calma sotto la pressione degli chef paga e girla.</p>
                        """, unsafe_allow_html=True)

                        st.markdown("""
                        <h3>Paci (LO STOMACO DEBOLE): 9.5</h3>
                        <p>Dopo mesi di organizzazione, tra sistemazione dei letti e cenone di capodanno, il mister Paci affronta il match tra alti e bassi. Parte con un palo in faccia per il coffe chiuso. Si rialza con la serata al Negro potendo tirare un sospiro di sollievo per aver fatto spendere 120€ ai suoi amici. Per lui l'anno non comincia nel migliore dei modi, tra una quasi rissa col papi Bax e una giornata passata tra coperte e vomito, salvato solo dalla sua dottoressa personale. Si riprende con grande stile, carico per poter gestire da un lato le richieste di foto della sua nuova ragazza e dall'altro le cagate dei suoi amici (sia letterali che non). Nella serata degli hamburger assemblatore di panini e supervisore.</p>
                        """, unsafe_allow_html=True)

                        st.markdown("""
                        <h3>Girla (FACCIAMOLE SUDAREEEE STE CIPOLLEE): 9.5</h3>
                        <p>Arriva con un zoo intero sulla spalla che però non riesce a soddisfare causa chiusura per feste sfondandosi però con due cope di nada al bar. Lui ha lo stomaco di ferro e il kebab non lo sente nemmeno, probabilmente aveva già preso farmaci per guarire l'inculata dei 120€. Nonostante questa cosa l'abbia destabilizzato un po' la sera di capodanno si diverte e si gode la serata, ma quando scoccano le 3 non c'è n'è per nessuno, si siede al tavolo entrando in mutismo selettivo. L'ultima sera si scontra con martina nella preparazione delle cipolle caramellate ma tutto è bene quel che finisce bene. (ma è mai stato a Madrid?)</p>
                        """, unsafe_allow_html=True)

                        st.markdown("""
                        <h3>Bax (PAPÀ V): 9</h3>
                        <p>Il papà del gruppo non si smentisce e arriva il 30 sera con tutti i bambini in gita. Gestisce alla perfezione spese e pasti e il 31 sera non si sbottona godendosi la serata davvero signore senza alzare troppo l'omero, ma rischia l'espulsione nel faccia a faccia con Paci, il tutto fortunatamente si risolve con una stretta di mano (e un abbraccio). Dopo che tutto l'1 prova ad utilizzare uno dei due bagni che erano occupati contemporaneamente da paga, decide di arrendersi e tornare in italia con cecilia per poter finalmente cagare.</p>
                        """, unsafe_allow_html=True)

                        st.markdown("""
                        <h3>Ceci (LA RADIOLINA): 9+</h3>
                        <p>Si presenta in inferiorità numerica a dover fronteggiare un'armata di boys pronta a distruggerle l'umore. Dopo la maratona di BARCELLONA effettuata per prendere un caffè con eugi fa ininterrottamente due cose: chiederti di fare una foto foto e se sei contento che lei sia lì con te e prontamente ogni volta tocca rispondere si. Anche lei con il timore di diventare stitica decide di abbandonare la nave in anticipo e scappa con bax il 2 mattina.</p>
                        """, unsafe_allow_html=True)

                        st.markdown("""
                        <h3>Paga (SI CON RISO SENZA LATTOSIO): 9-</h3>
                        <p>Inizia la vacanza in maniera tranquilla lasciandosi trascinare da girla verso il lato oscuro del risparmio ed ecco qui il primo errore, un kebab dalla qualità discutibile mangiato il 30 dicembre alle ore 13.24 lo rende il più grande incubo di ferdi, il quale non riesce più ad usare il bagno nei 3 giorni successivi. A capodanno fa la sua figura, si iscrive al tabellino ma per problemi di organizzazione non riesce a siglare la doppietta. L'ultima sera si improvvisa capo cuoco a casa martina supervisionando la creazione degli hamburger.</p>
                        """, unsafe_allow_html=True)

                        st.markdown("""
                        <h3>Ferdi (CAZZO DICI): 9</h3>
                        <p>Dopo aver passato il natale in solitaria viene invaso dall'uragano italiano, ma non si scompone e sembra apprezzare l'arrivo dei monzesi grazie anche al supporto prontamente arrivato dalla bolivia. In casa fa finta di fare qualcosa per nn fare brutta figura con gli ospiti mostrando subito l'italiano imparato in questi mesi: "Mi mangio la mela mentecatto succhiami il cazzo". Al Negro rojo non incide, dimenticandosi le chiavi della discordia rischiando di causare una rissa tra coinquilini. L'ultima sera sente la pressione di girla perdendo la lucidità davanti ad un bicchiere per la felicità della proprietaria di casa.</p>
                        """, unsafe_allow_html=True)

                        st.markdown("""
                        </div>
                        """, unsafe_allow_html=True)

    # Statistiche Generali
    st.markdown("---")
    st.markdown("<h2 style='text-align: center; margin-bottom: 2rem;'>📈 STATISTICHE STORICHE</h2>", unsafe_allow_html=True)
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.markdown("""
        <div class="game-container">
            <h3 style="text-align: center;">🏆 TOP 10 VOTI</h3>
            <ol style="padding-left: 1.5rem;">
                <li>Trave (Sardegna) - 10</li>
                <li>Marti (Barcellona) - 10</li>
                <li>Il bimbo (Croazia) - 10-</li>
                <li>Girla (Barcellona) - 9.5</li>
                <li>Paci (Barcellona) - 9.5</li>
                <li>Paga (Corfù) - 9.5</li>
                <li>Ceci (Barcellona) - 9+</li>
                <li>Bax (Croazia) - 9+</li>
                <li>Girla (Sardegna) - 9</li>
                <li>Gaia (Corfù) - 9</li>
            </ol>
        </div>
        """, unsafe_allow_html=True)
    
    with col2:
        st.markdown("""
        <div class="game-container">
            <h3 style="text-align: center;">👥 PRESENZE TOTALI</h3>
            <ul style="padding-left: 1.5rem;">
                <li>Girla - 5 vacanze</li>
                <li>Paga - 5 vacanze</li>
                <li>Bax - 5 vacanze</li>
                <li>Paci - 5 vacanze</li>
                <li>Ari - 4 vacanze</li>
                <li>Ceci - 4 vacanze</li>
                <li>Chiara - 4 vacanze</li>
                <li>Gaia - 3 vacanze</li>
                <li>Gio - 2 vacanze</li>
                <li>Trave - 2 vacanze</li>
            </ul>
        </div>
        """, unsafe_allow_html=True)
    
    with col3:
        st.markdown("""
        <div class="game-container">
            <h3 style="text-align: center;">📊 CLASSIFICA MEDIE</h3>
            <ol style="padding-left: 1.5rem;">
                <li>Girla - 9 (5 vacanze)</li>
                <li>Bax - 8.8 (5 vacanze)</li>
                <li>Paga - 8.6 (5 vacanze)</li>
                <li>Paci - 8.55 (5 vacanze)</li>
                <li>Ceci - 8.4 (4 vacanze)</li>
                <li>Gaia - 8.17 (3 vacanza)</li>
                <li>Ari - 8.06 (4 vacanze)</li>
                <li>Chiara - 8 (4 vacanze)</li>
            </ol>
        </div>
        """, unsafe_allow_html=True)

    # Schede Personali
    st.markdown("---")
    st.markdown("<h2 style='text-align: center; margin-bottom: 2rem;'>📚 SCHEDE PERSONALI</h2>", unsafe_allow_html=True)
    
    members = ["Paci", "Girla", "Paga", "Bax", "Ari", "Chiara", "Ceci", "Gaia",]
    tabs = st.tabs(members)
    
    for i, member in enumerate(members):
        with tabs[i]:
            col1, col2 = st.columns([1, 2])
            
            with col1:
                try:
                    st.image(f"{member}.jpg", caption=member, use_container_width =True)
                except:
                    st.markdown(f"""
                    <div style="background: var(--card-bg); height: 300px; display: flex; justify-content: center; align-items: center; border-radius: 12px;">
                        <p style="color: var(--text-secondary);">Immagine non disponibile</p>
                    </div>
                    """, unsafe_allow_html=True)
                
                # Statistiche personali
                if member == "Paci":
                    stats = {
                        "Vacanze": 4,
                        "Voto più alto": "9.5 (Barcellona)",
                        "Media voti": 8.55,
                        "Miglior performance": "Barcellona 2024/25",
                        "Soprannomi": ["SARDO VERO", "IL PADRINO", "IL BENEFATTORE", "COLUI CHE LA SPIEGA", "LO STOMACO DEBOLE"]
                    }
                elif member == "Girla":
                    stats = {
                        "Vacanze": 5,
                        "Voto più alto": "9.5 (Barcellona)",
                        "Media voti": 9,
                        "Miglior performance": "Barcellona 2024/25",
                        "Soprannomi": ["IL T-REX", "PITA ADVISOR", "ANTHONY MARTIAL", "EHI EWA", "FACCIAMOLE SUDAREEEE STE CIPOLLEE"]
                    }
                elif member == "Paga":
                    stats = {
                        "Vacanze": 5,
                        "Voto più alto": "9.5 (Corfù)",
                        "Media voti": 8.6,
                        "Miglior performance": "Corfù 2022",
                        "Soprannomi": ["ER FREGOLA", "IL BARISTA", "IL MEGAFONO", "RIGATONI, NO FUSILLI", "SI CON RISO SENZA LATTOSIO"]
                    }
                elif member == "Bax":
                    stats = {
                        "Vacanze": 5,
                        "Voto più alto": "9+ (Croazia)",
                        "Media voti": 8.8,
                        "Miglior performance": "Croazia 2024",
                        "Soprannomi": ["NICKI LAUD", "IL PENGWIN", "LA ZECCA DI STATO", "DELUX", "PAPÀ V"]
                    }
                elif member == "Ari":
                    stats = {
                        "Vacanze": 4,
                        "Voto più alto": "9 (Puglia)",
                        "Media voti": 8.06,
                        "Miglior performance": "Puglia 2023",
                        "Soprannomi": ["BULBASAUR", "LA CAMIONISTA", "LA BENZINAIA", "STANGA?MAGARI", "IN SMARTWORKING"]
                    }
                elif member == "Chiara":
                    stats = {
                        "Vacanze": 4,
                        "Voto più alto": "8+ (Corfù, Sardegna)",
                        "Media voti": 8,
                        "Miglior performance": "Corfù 2022",
                        "Soprannomi": ["LO GNOCCO", "BIG ROM", "LA PART-TIME", "AMMAN"]
                    }
                elif member == "Ceci":
                    stats = {
                        "Vacanze": 4,
                        "Voto più alto": "9+ (Barcellona)",
                        "Media voti": 8.4,
                        "Miglior performance": "Barcellona 2024/25",
                        "Soprannomi": ["@JACOGILA", "THE WEEKEND", "LA CAFONA", "LA RADIOLINA"]
                    }
                elif member == "Gaia":
                    stats = {
                        "Vacanze": 3,
                        "Voto più alto": "9 (Corfù)",
                        "Media voti": 8.17,
                        "Miglior performance": "Corfù 2022",
                        "Soprannomi": ["LA LAVASTOVIGLIE", "LA POETESSA", "DORAEMON"]
                    }
                
                st.markdown(f"""
                <div style="background: rgba(106, 90, 205, 0.1); padding: 1.5rem; border-radius: 12px; margin-top: 1rem;">
                    <h4 style="color: var(--accent); margin-bottom: 1rem;">📊 Statistiche Personali</h4>
                    <p><strong>Vacanze:</strong> {stats['Vacanze']}</p>
                    <p><strong>Voto più alto:</strong> {stats['Voto più alto']}</p>
                    <p><strong>Media voti:</strong> {stats['Media voti']}</p>
                    <p><strong>Miglior performance:</strong> {stats['Miglior performance']}</p>
                    <p><strong>Soprannomi:</strong> {", ".join(stats['Soprannomi'])}</p>
                </div>
                """, unsafe_allow_html=True)
            
            with col2:
                st.markdown("""
                <div class="game-container">
                    <h3>📜 Pagelle Storiche</h3>
                """, unsafe_allow_html=True)
                
                if member == "Paci":
                    st.markdown("""
                    <h4>🇮🇹 Sardegna 2021: 8 (SARDO VERO: EJA)</h4>
                    <p>Conclude il suo mese di permanenza raggiungendo quasi la cittadinanza onoraria, festeggia la settimana da fidanzato non nel migliore dei modi, ma a tutti gli effetti risultata il miglior cagatore e il mastro cannaiolo.</p>
                    
                    <h4>🇬🇷 Corfù 2022: 9- (IL PADRINO)</h4>
                    <p>Pronto per l'ennesima estate da single, ma sta volta da solo. Fiero del suo status, ma con ancora qualche strascico. Gli manca sempre la prima marcia, ma non cade nella tentazione dei roiti nucleari. Ultima sera maledetto da un vodoo greco. Mette in stand by la compagnia per una sera, causa: possiamo dire che "papà è tornato".</p>
                    
                    <h4>🇮🇹 Puglia 2023: 8 (IL BENEFATTORE)</h4>
                    <p>Dopo il periodo di carcere (non per aver rubato le barrette) a Monopoli, torna insieme ai boys ad Alezio city. La sua specialità è palleggiare e giocare a calcio appena scesi dalla macchina, incurante del terreno di gioco perde qualche pallone di troppo. Dopo una sostanziosa donazione alla fondazione Panigalli, viene ricompensato con un goal al 95'. Mezzo voto in meno per lo stile talmente zanza che Cellery può accompagnare solo; menzione d'onore per gli occhiali di cui si voleva liberare 30 secondi dopo averli comprati.</p>
                    
                    <h4>🇭🇷 Croazia 2024: 8.5 (COLUI CHE LA SPIEGA)</h4>
                    <p>Partenza in salita per lui dopo il tentato omicidio da parte di Ari con l'aria condizionata [si si!] che gli ha causato un giorno di stop. In tutta la vacanza non tocca mai i fornelli e nemmeno il cazzo, per fortuna a Monza lo aspettano almeno quattro amiche 2010 della sorella. Durante tutta la vacanza si gasa per le storie di una tipa a Caso, peccato che l'ultimo giorno scoprirà essere la fidanzata di una famosa cantante Milanese (zona Duomo). Impossibile non fare acquisti scam ogni vacanza: 7€ di succo a bordo strada e 7€ di Puff in disco (girla non approva).</p>
                    
                    <h4>🇪🇸 Barcellona 2024/25: 9.5 (LO STOMACO DEBOLE)</h4>
                    <p>Dopo mesi di organizzazione, tra sistemazione dei letti e cenone di capodanno, il mister Paci affronta il match tra alti e bassi. Parte con un palo in faccia per il coffe chiuso. Si rialza con la serata al Negro potendo tirare un sospiro di sollievo per aver fatto spendere 120€ ai suoi amici. Per lui l'anno non comincia nel migliore dei modi, tra una quasi rissa col papi Bax e una giornata passata tra coperte e vomito, salvato solo dalla sua dottoressa personale. Si riprende con grande stile, carico per poter gestire da un lato le richieste di foto della sua nuova ragazza e dall'altro le cagate dei suoi amici (sia letterali che non). Nella serata degli hamburger assemblatore di panini e supervisore.</p>
                    """, unsafe_allow_html=True)
                
                elif member == "Girla":
                    st.markdown("""
                    <h4>🇮🇹 Sardegna 2021: 9 (IL T-REX)</h4>
                    <p>Crea grossi meme per tutta la vacanza, si riscopre artista, ma resta umile rimanendo l'uomo del filtro, tranne la sera di san Lorenzo nella quale si improvvisa tiratore scelto. Batte miglio tornando in positivo di 26 centesimi.</p>
                    
                    <h4>🇬🇷 Corfù 2022: 8.5 (PITA ADVISOR)</h4>
                    <p>Gestisce l'economia della casa e della vacanza chiudendo come previsto con il bilancio migliore tra tutti. È MOLTO attento alla pulizia dopo le due settimane di convivenza con letizia ad eccezione del pigiama che lo usa ancora sporco. L'ultima sera regala spettacolo facendo capire ad ari che non è il suo tipo e rischia la rissa quando gli viene chiesto 1€ di mancia. Se volete mangiare una Pita sapete a chi chiedere.</p>
                    
                    <h4>🇮🇹 Puglia 2023: 9 (ANTHONY MARTIAL)</h4>
                    <p>Quest'anno viene contraddistinto dalla sua eleganza, dovuta all'utile generato in questo suo 2023, grazie al quale si imborghesisce e non indossa capi al di sotto del millino. Anche quest'anno non si smentisce nella creazione di meme (potrebbe tranquillamente essere l'admin di nonsonobellomaspaccio) però un problema fisico lo costringe ai box più di una volta. Nelle due serate fatte non si iscrive al tabellino dei marcatori per non ritrovarsi nella stessa situazione dell'Ucraina.</p>
                    
                    <h4>🇭🇷 Croazia 2024: 9 (EHI EWA, HAI PROGRAMMI STASERA?)</h4>
                    <p>Freschissimo di laurea ci sono grandi aspettative su di lui, dovute anche ad un aumento di budget dopo i recenti investimenti ben fatti. Illude tutti offrendo la cena a Spalato, ma in 0.0035 secondi finisce su Splitwise, facendo capire che la musica non è cambiata (come in macchina di Bax). In cucina però si esalta caramellando qualsiasi cosa assomigli ad una cipolla e in serata si cucina le 2005 finlandesi diffondendo il "Lesgoski". Il suo prime lo vive sicuramente in Bosnia dove grazie al cambio favorevole, vive due giorni in Black Friday che gli permettono di ordinare anche l'antipasto a cena. Verso fine vacanza si scopre che il suo grande miglioramento in inglese non è dovuto alle lezioni della Terzi ma a delle call con l'headquarter di Varsavia.</p>
                    
                    <h4>🇪🇸 Barcellona 2024/25: 9.5 (FACCIAMOLE SUDAREEEE STE CIPOLLEE)</h4>
                    <p>Arriva con un zoo intero sulla spalla che però non riesce a soddisfare causa chiusura per feste sfondandosi però con due cope di nada al bar. Lui ha lo stomaco di ferro e il kebab non lo sente nemmeno, probabilmente aveva già preso farmaci per guarire l'inculata dei 120€. Nonostante questa cosa l'abbia destabilizzato un po' la sera di capodanno si diverte e si gode la serata, ma quando scoccano le 3 non c'è n'è per nessuno, si siede al tavolo entrando in mutismo selettivo. L'ultima sera si scontra con martina nella preparazione delle cipolle caramellate ma tutto è bene quel che finisce bene. (ma è mai stato a Madrid?)</p>
                    """, unsafe_allow_html=True)
                
                elif member == "Paga":
                    st.markdown("""
                    <h4>🇮🇹 Sardegna 2021: 8 (ER FREGOLA)</h4>
                    <p>Mangia di notte carciofini e funghi a non finire. Il pagafigometro è alle stelle ma si esaurisce in una sola poppata con la marti. Sforna più nuggets del MC ma non viene assunto per mancanza di laurea.</p>
                    
                    <h4>🇬🇷 Corfù 2022: 9.5 (IL BARISTA)</h4>
                    <p>Paga di più i voli perché deve imbarcare il boa in stiva e le ragazze a cui ha preparato il caffè lo sanno bene. Passa ogni alba a cavalcioni sulla terrazza facendo catcalling e quando funziona gli tocca giocare coi tacchetti a 6 nel pantano (meglio non girare il materasso). Vive di rendita dalle pentole pulite il primo giorno. Ci ricorda che: Abbiamo casa a 3 minuti a piedi dal Montecristo.</p>
                    
                    <h4>🇮🇹 Puglia 2023: 8 (IL MEGAFONO)</h4>
                    <p>Un po' sottotono rispetto agli altri anni forse anche grazie al fatto che arriva a pancia piena con un goal poco prima della partenza. La sua giornata tipo è: mi sveglio, mangio, rutto, cago e bestemmio, per poi ripetere questa sequenza fino a cena (ma ha anche dei difetti). Non ha più il fisico di una volta, però si merita mezzo voto in più per l'insalata di riso che è bastata a sfamare tutti gli abitanti di Alezio city.</p>
                    
                    <h4>🇭🇷 Croazia 2024: 9- (RIGATONI, NO FUSILLI)</h4>
                    <p>Il re di Brisbane ha sulle spalle la responsabilità di aver prenotato 10 case, ottima quella "a 3 minuti da Dubrovnik" se non fosse che in mezzo c'è la dogana bosniaca con un'ora di coda ad ogni passaggio. Durante il viaggio itinerante ne organizza un altro per la settimana dopo, un po' per poppare in toscana e un po' per scroccare in Sarda e all'Elba. Prima che la Polo di Chiara partisse gli lascia un bel rigatone sopra, costringendo i boys a 5 giorni di stenti in attesa del preventivo per una portiera nuova, mentre lui muore le ultime due serate. -0,5 per i video home tour alla ciuccia toscana, ma +0,5 per gli shot offerti alle finlandesi per la squadra.</p>
                    
                    <h4>🇪🇸 Barcellona 2024/25: 9- (SI CON RISO SENZA LATTOSIO)</h4>
                    <p>Inizia la vacanza in maniera tranquilla lasciandosi trascinare da girla verso il lato oscuro del risparmio ed ecco qui il primo errore, un kebab dalla qualità discutibile mangiato il 30 dicembre alle ore 13.24 lo rende il più grande incubo di ferdi, il quale non riesce più ad usare il bagno nei 3 giorni successivi. A capodanno fa la sua figura, si iscrive al tabellino ma per problemi di organizzazione non riesce a siglare la doppietta. L'ultima sera si improvvisa capo cuoco a casa martina supervisionando la creazione degli hamburger.</p>
                    """, unsafe_allow_html=True)
                
                elif member == "Bax":
                    st.markdown("""
                    <h4>🇮🇹 Sardegna 2021: 8.5 (NICKI LAUDA)</h4>
                    <p>Recupera in fretta dall'infortunio per esserci e guidare la squadra con la sua puma infuocata. Non vuole i soldi della cauzione perché non è un poveraccio. Mezzo punto in meno per il gommone rotto.</p>
                    
                    <h4>🇬🇷 Corfù 2022: 9- (IL PENGWIN)</h4>
                    <p>Dopo la buona prestazione dell'anno scorso si riconferma pilota, prova a scaldare le gomme dietro la safety car innescando le ire dei maranza greci. Scommette il patrimonio familiare con girla puntando su Paci. Se non ti sveglia con la musica techno la mattina sicuro chiederà "chi ha bevuto l'acqua stanotte?"</p>
                    
                    <h4>🇮🇹 Puglia 2023: 8.5 (LA ZECCA DI STATO)</h4>
                    <p>Rinnova per il terzo anno con la scuderia per la felicità dei tifosi. Rimane fregato essendo l'unico ad avere soldi in contanti, sperando che tornino prima della benza di Corfù 2022. I genitori di tutti sono tranquilli perché conoscono ogni nostro spostamento grazie a lui che fa le veci di Pierluigi Pardo con Marta e la Carla. Ogni giorno al Mare porta un ombrellone solo per se stesso causa allergia al sole. Se non giochi al "grande gioco dei nomi" ti sgozza, stacce.</p>
                    
                    <h4>🇭🇷 Croazia 2024: 9+ (DELUX)</h4>
                    <p>Per il quarto anno di fila si riconferma pilota, consuma un po' troppa benzina guidando come un pazzo e una volta, ascoltando Milano Testarossa, tenta la quadkill sui boys andando dritto ad una curva. Le sua giornata tipo è caratterizzata da: 3 ore di macchina con max 5 canzoni diverse, minimo una tappa alla Lidl/Plodine/Mumbaza, max 2 ore in spiaggia, guardare la stellata ogni sera (senza mai trovare Giove e Saturno). Il tutto viene sempre riportato a fine giornata a Maria che ormai è più informata di paga sulla croazia. Fa un po' da papà agli altri tre boys, inoltre quest'anno sostituisce il gioco dei nomi con qualsiasi gioco di carte possibile. -0.5 per il doppio passo del drink "offerto"a paga in disco.</p>
                    
                    <h4>🇪🇸 Barcellona 2024/25: 9 (PAPÀ V)</h4>
                    <p>Il papà del gruppo non si smentisce e arriva il 30 sera con tutti i bambini in gita. Gestisce alla perfezione spese e pasti e il 31 sera non si sbottona godendosi la serata davvero signore senza alzare troppo l'omero, ma rischia l'espulsione nel faccia a faccia con Paci, il tutto fortunatamente si risolve con una stretta di mano (e un abbraccio). Dopo che tutto l'1 prova ad utilizzare uno dei due bagni che erano occupati contemporaneamente da paga, decide di arrendersi e tornare in italia con cecilia per poter finalmente cagare.</p>
                    """, unsafe_allow_html=True)
                
                elif member == "Ari":
                    st.markdown("""
                    <h4>🇮🇹 Sardegna 2021: 7.5 (BULBASAUR)</h4>
                    <p>Qualche snitchata di troppo le fa crescere le treccine colorate alla 69. Quando non dorme è simpatica come quelli delle prevendite in spiaggia.</p>
                    
                    <h4>🇬🇷 Corfù 2022: 8 (LA CAMIONISTA)</h4>
                    <p>Situazione sentimentale inizialmente in dubbio ma chiarita appena in tempo e questo fa sì che passi una settimana mediamente tranquilla, esibendosi in uscite come vaffanculo, cazzo e porca troia a greci che però l'italiano lo capiscono. Non resiste più di due minuti senza parlare di sesso e in quei due minuti parla di Giulio. Nonostante l'infortunio nel finale non rinuncia al suo pacchetto di heets giornaliero a 4€.</p>
                    
                    <h4>🇮🇹 Puglia 2023: 9- (LA BENZINAIA)</h4>
                    <p>Arriva con il collo marchiato dal Conte Mattia e uccide subito il mood della vacanza utilizzando un terzo del budget della spesa per comprare gli assorbenti; e mentre a lei non è mai arrivato il ciclo i boys si sono visti costretti ad alternare giorni senza dentifricio a giorni senza sapone per le mani. Si sta ancora chiedendo perché il pieno di benzina iniziale non sia stato messo su Splitwise, abbassando ad ogni richiesta il QI medio italiano, ma anche strappando ogni volta una risata a tutto il gruppo e facendo alzare continuamente il suo voto.</p>
                    
                    <h4>🇭🇷 Croazia 2024: 8- (STANGA?MAGARI)</h4>
                    <p>C'è un po' di Ari in questo Mattia. Per vendicarsi dei boys che hanno ordinato 10kg di carne in Bosnia gli attacca un bel virus prima di andarsene. Post laghi di Plitvice ha dei polpacci che manco @nicolòcereda01. Le partenze in salita non sono il suo forte ma non ha colpe sui danni causati alla Verpelli's Polo. Tenta l'omicidio su Paci alzando l'aria condizionata, ma purtroppo lo lascia solo oneshot. Nonostante il poco tempo passato al sole è riuscita ad abbronzarsi come Carlo Conti.</p>
                    
                    <h4>🇪🇸 Barcellona 2024/25: 10 (IN SMARTWORKING)</h4>
                    <p>Pagella d'onore nonostante la sua assenza, che però le ha fatto guadagnare punti infiniti come figlia. Fortunatamente per lei si trattava del primo capodanno low-cost non causando rimorsi dal punto di vista economico. Viene comunque aggiornata tramite videochiamata anche se averla dal vivo sarebbe stata tutt'altra cosa ❤.</p>
                    """, unsafe_allow_html=True)
                
                elif member == "Chiara":
                    st.markdown("""
                    <h4>🇮🇹 Sardegna 2021: 8+ (LO GNOCCO)</h4>
                    <p>Sta ancora cercando il computer per vedere le olimpiadi. Alterna lamentele ad ordini con picchi di altruismo saltuari. È ancora a porto rotondo ad aspettare gli spaghetti alle vongole.</p>
                    
                    <h4>🇬🇷 Corfù 2022: 8+ (BIG ROM)</h4>
                    <p>Parte con la squadra nonostante un po' di influenza per il precampionato alzando un po' troppo il gomito la sera, dando spettacolo pisciando in mare come mamma l'ha fatta. L'acqua sicuramente non regge il confronto con Milano Marittima però una o due spiagge si sono salvate. Negli ultimi giorni di mercato un trasferimento inaspettato la porta A LLORET DE MAR. Entro, infetto, esco, ciao.</p>
                    
                    <h4>🇮🇹 Puglia 2023: 7.5 (LA PART-TIME)</h4>
                    <p>Come l'anno scorso viene richiamata dal prestito a metà stagione. Solo una serata no per lei, causa risposta deludente da parte della relatrice della tesi, ma viene distratta dai numerosi rutti dei boys dopo l'ottima pasta al pesto Rana. Voto basso a causa della vittoria sia del premio come miglior outfit delle girls, con il vestito d'oro ad alberobello, sia quello della girl meno scassa cazzo.</p>
                    
                    <h4>🇭🇷 Croazia 2024: 8 (AMMAN)</h4>
                    <p>Se l'acqua di Corfù era come quella di Milano Marittima, i paesaggi croati invece assomigliano molto alla Giordania (ancora da capire se ci sia andata). Se sali sulla sua macchina sei certo di vedere tutti i patrimoni Unesco ad ogni viaggio. Le sue speranze sono riposte nella cena di pesce dell'ultima sera, dove rimane delusa da un risotto alla milanese. Per il terzo anno di fila viene richiamata dal prestito, ma sta volta si porta dietro anche Ari. -0.5 per il solito part time, + 0.5 per aver messo la macchina.</p>
                    """, unsafe_allow_html=True)
                
                elif member == "Ceci":
                    st.markdown("""
                    <h4>🇮🇹 Sardegna 2021: 8 (@JACOGILA)</h4>
                    <p>C'è un po' di ceci in questo jacopo; il suo apparecchio puzza come l'acqua di porto ottiolu, in casa è utile come l'ombrellone con 50 km/h di vento. Mezzo voto in più per la scopata sul letto di trave.</p>
                    
                    <h4>🇬🇷 Corfù 2022: 8 (THE WEEKEND)</h4>
                    <p>C'è un po' di ceci in questo... Di giorno pacata e amichevole e di notte a tratti difficile da controllare. Nelle due sere al Montecristo si sbronza pesantemente da un momento all'altro senza che nessuno capisca come e quando sia successo. Appena sente blinding lights diventa più piccante del spicy cheese avli sauce. Un ringraziamento a jaki per il passaggio (poverino) Ps non prestatele i calzini.</p>
                    
                    <h4>🇮🇹 Puglia 2023: 8.5 (LA CAFONA)</h4>
                    <p>Partendo dal presupposto che il duomo fa cagare perché ci sono i piccioni fuori, è importante evidenziare la tranquillità e i nervi saldi con cui gestisce la scelta della spiaggia la mattina dell'arrivo ad Alezio city, insistendo molto per andare in questo luogo sconosciuto detto Porto Cesareo. Purtroppo come navigatore non da il meglio di sè ma almeno permette alle girls di risparmiare una notte di affitto a Monopoli, facendole arrivare il giorno dopo con le sue indicazioni.</p>
                    
                    <h4>🇪🇸 Barcellona 2024/25: 9+ (LA RADIOLINA)</h4>
                    <p>Si presenta in inferiorità numerica a dover fronteggiare un'armata di boys pronta a distruggerle l'umore. Dopo la maratona di BARCELLONA effettuata per prendere un caffè con eugi fa ininterrottamente due cose: chiederti di fare una foto foto e se sei contento che lei sia lì con te e prontamente ogni volta tocca rispondere si. Anche lei con il timore di diventare stitica decide di abbandonare la nave in anticipo e scappa con bax il 2 mattina.</p>
                    """, unsafe_allow_html=True)
                
                elif member == "Gaia":
                    st.markdown("""
                    <h4>🇮🇹 Sardegna 2021: 7.5 (LA LAVASTOVIGLIE)</h4>
                    <p>Cauzione a rischio per il bicchiere rotto; è un'amante delle spiagge sconosciute. Difficilmente ha gli occhi aperti dopo il tramonto ma recupera in cucina.</p>
                    
                    <h4>🇬🇷 Corfù 2022: 9 (LA POETESSA)</h4>
                    <p>Grazie a qualche sostanza resiste sorprendentemente fino all'ultima sera dopo il tramonto, visita più grotte di Rocco Siffredi e delizia tutti con una grande massima che tradurremo dal latino nel seguente modo:"Sei mia e adesso ti infilo il pisello" PS: No cazzi dopo i pasti.</p>
                    
                    <h4>🇮🇹 Puglia 2023: 8 (DORAEMON)</h4>
                    <p>A differenza delle altre ragazze porta tutto il necessario e si permette il lusso di portarsi la sua colazione personale che nasconde accuratamente dai predatori durante il corso di tutta la vacanza. Piccolo scivolone nel suo ambito, le lavastoviglie: far partire il programma ECO da 4 ore e poi togliere la chiave che tiene accesa la corrente non è stata un'ottima idea. Importante citare anche la sua crisi di mezza età alla Praja.</p>
                    """, unsafe_allow_html=True)
                
                st.markdown("</div>", unsafe_allow_html=True)

##########################################################################################################

def album_page():
    st.title("Album dei ricordi")
    st.markdown("""
    <div style="color: var(--text-secondary); margin-bottom: 3rem; line-height: 1.7; font-size: 1.1rem;">
        Work in progress (datemi del tempo ho già fatto 3000 righe di codice in Python)
    </div>
    """, unsafe_allow_html=True)

###################################################################################################################

def game_1():
    # Inizializzazione session state
    if 'initialized' not in st.session_state:
        st.session_state.questions_used = set()
        st.session_state.team1_score = 0
        st.session_state.team2_score = 0
        st.session_state.current_question = None
        st.session_state.game_started = False
        st.session_state.current_team = 1
        st.session_state.question_count = 0
        st.session_state.game_over = False
        st.session_state.selected_answer = None
        st.session_state.form_key = str(random.randint(0, 1000000))
        st.session_state.restart_key = str(random.randint(0, 1000000))
        st.session_state.initialized = True
        
    st.title("Il re delle pagelle")
    st.markdown("""
    <div style="color: var(--text-secondary); margin-bottom: 3rem; line-height: 1.7; font-size: 1.1rem;">
        Due squadre si sfidano rispondendo a 10 domande ciascuna tratte dalle pagelle! Vince chi totalizza più punti.
    </div>
    """, unsafe_allow_html=True)

    # Database delle domande (200 domande)
    questions_db = [
        {
            "question": "Famosa via a San Teodoro",
            "options": ["Traverso", "Traversa", "Ll Traverso", "La Traversa"],
            "correct": "La Traversa",
            "source": "Sardegna 2021"
        },
        {
            "question": "Quanti chili perse Miglio in Sardegna 2021?",
            "options": ["5kg", "7kg", "9kg", "12kg"],
            "correct": "9kg",
            "source": "Sardegna 2021"
        },
        {
            "question": "Come veniva chiamata Ari nelle pagelle Sardegna 2021?",
            "options": ["Bulbasaur", "La Camionista", "Stanga?Magari", "La Benzinaia"],
            "correct": "Bulbasaur",
            "source": "Sardegna 2021"
        },
        {
            "question": "Perché Ceci ha preso mezzo voto in più in Sardegna 2021?",
            "options": ["Per la scopata sul letto di Trave", "Per l'apparecchio", "Per Porto Ottiolu", "Perchè era utile come l’ombrellone con 50 km/h di vento"],
            "correct": "Per la scopata sul letto di Trave",
            "source": "Sardegna 2021"
        },
        {
            "question": "Cosa mangiava Paga di notte in Sardegna 2021?",
            "options": ["Nuggets", "Carciofini e funghi", "Carciofini", "Funghi"],
            "correct": "Carciofini e funghi",
            "source": "Sardegna 2021"
        },
        {
            "question": "Perché Chiara usava il computer in Sardegna 2021?",
            "options": ["Per ordinare gli spaghetti alle vongole", "Per vedere le Olimpiadi", "Per prenotare voli di ritorno", "Per giocare a Snake"],
            "correct": "Per vedere le Olimpiadi",
            "source": "Sardegna 2021"
        },
        {
            "question": "Perché Bax ha perso mezzo punto in Sardegna 2021?",
            "options": ["Per il gommone rotto", "Per la Puma infuocata", "Per aver litigato con la ceci", "Per non aver pagato la cauzione"],
            "correct": "Per il gommone rotto",
            "source": "Sardegna 2021"
        },
        {
            "question": "Perché la cauzione di Gaia era a rischio in Sardegna 2021?",
            "options": ["Per il tavolo rotto", "Per il letto sporco", "Per il bicchiere rotto", "Per la lavastoviglie rotta"],
            "correct": "Per il bicchiere rotto",
            "source": "Sardegna 2021"
        },
        {
            "question": "Come venivano chiamate Auro e Gio nelle pagelle Sardegna 2021?",
            "options": ["Le Gemelle", "Lunatiche", "Le Siamesi", "Le tossiche"],
            "correct": "Lunatiche",
            "source": "Sardegna 2021"
        },
        {
            "question": "Quale titolo ha ottenuto Paci in Sardegna 2021?",
            "options": ["Miglior tiratore scelto", "Miglior cagatore", "Miglior sboccatore", "Miglior bevitore"],
            "correct": "Miglior cagatore",
            "source": "Sardegna 2021"
        },
        {
            "question": "Di quanti centesimi Girla ha battuto Miglio in Sardegna 2021?",
            "options": ["25 centesimi", "26 centesimi", "35 centesimi", "36 centesimi"],
            "correct": "26 centesimi",
            "source": "Sardegna 2021"
        },
        {
            "question": "Come veniva chiamato Trave nelle pagelle Corfù 2022?",
            "options": ["Il Tiktoker", "Il Barista", "Il Pengwin", "Pita Advisor"],
            "correct": "Il Tiktoker",
            "source": "Corfù 2022"
        },
        {
            "question": "Cosa ha rinunciato a mangiare Trave a Corfù 2022?",
            "options": ["Anguria", "Tiramisù", "Conchiglie", "Albume"],
            "correct": "Albume",
            "source": "Corfù 2022"
        },
        {
            "question": "Quanto costava il pacchetto giornaliero di heets di Ari a Corfù 2022?",
            "options": ["2€", "3€", "4€", "5€"],
            "correct": "4€",
            "source": "Corfù 2022"
        },
        {
            "question": "Con quale canzone di The Weekend la ceci diventava piccante a Corfù 2022?",
            "options": ["After Hours", "Save Your Tears", "Hardest to Love", "Blinding Lights"],
            "correct": "Diventava più piccante",
            "source": "Corfù 2022"
        },
        {
            "question": "Dove è stata trasferita Chiara a Corfù 2022?",
            "options": ["Lloret de Mar", "Milano Marittima", "Gallipoli", "Giordania"],
            "correct": "Lloret de Mar",
            "source": "Corfù 2022"
        },
        {
            "question": "Cosa soffriva di più Bax a Corfù 2022?",
            "options": ["Ragazze sconosciute in casa", "Mancanza d'acqua", "Aria condizionata", "il sole"],
            "correct": "Mancanza d'acqua",
            "source": "Corfù 2022"
        },
        {
            "question": "Chi ha pagato di più i voli a Corfù 2022?",
            "options": ["Chiara", "Ceci", "Paci", "Paga"],
            "correct": "Paga",
            "source": "Corfù 2022"
        },
        {
            "question": "Di che marca aveva la camicia Girla, quando il tipo gli chiedeva la mancia a Corfù 2022?",
            "options": ["Zara", "Polo", "Primark", "Alcott"],
            "correct": "Primark",
            "source": "Corfù 2022"
        },
        {
            "question": "Quanto distava casa boys dal Montecristo",
            "options": ["1 min", "2 min", "3 min", "4 min"],
            "correct": "3 min",
            "source": "Corfù 2022"
        },
        {
            "question": "Era single Paci a Corfù 2022?",
            "options": ["Si, ma non da solo", "Si, da solo", "No, ma non da solo", "No, da solo"],
            "correct": "Si, da solo",
            "source": "Corfù 2022"
        },
        {
            "question": "Come veniva chiamato Girla nelle pagelle Puglia 2023?",
            "options": ["Anthony Martial", "Ehi Ewa", "Il T-Rex", "Pita Advisor"],
            "correct": "Anthony Martial",
            "source": "Puglia 2023"
        },
        {
            "question": "Cosa fa cagare per la Ceci",
            "options": ["Porto Cesareo", "Alezio City", "Monopoli", "il Duomo"],
            "correct": "il Duomo",
            "source": "Puglia 2023"
        },
        {
            "question": "Cosa ha comprato Ari che ha ucciso il mood della vacanza in Puglia 2023?",
            "options": ["Heets", "Struccanti", "Assorbenti", "Melanzane"],
            "correct": "Assorbenti",
            "source": "Puglia 2023"
        },
        {
            "question": "Cosa nascondeva Gaia durante la vacanza in Puglia 2023?",
            "options": ["Soldi", "Colazione", "Ragazzo", "i suoi 22 anni"],
            "correct": "Colazione",
            "source": "Puglia 2023"
        },
        {
            "question": "Con chi avrebbe duettato Gio secondo le pagelle Puglia 2023?",
            "options": ["Cristiano Ronaldo", "Lionel Messi", "Zlatan Ibrahimovic", "Maradona"],
            "correct": "Cristiano Ronaldo",
            "source": "Puglia 2023"
        },
        {
            "question": "Cosa ha donato Paci in Puglia 2023?",
            "options": ["Occhiali da sole", "Barrette", "Cappellino", "Soldi"],
            "correct": "Soldi",
            "source": "Puglia 2023"
        },
        {
            "question": "Di che colore era il vestito con cui Chiara ha vinto il premio come miglior outfit in Puglia 2023?",
            "options": ["Rosso", "Argento", "Oro", "Turchese"],
            "correct": "Oro",
            "source": "Puglia 2023"
        },
        {
            "question": "Che anno consecutivo era con la scuderia per Bax in Puglia 2023?",
            "options": ["primo", "secondo", "terzo", "quarto"],
            "correct": "terzo",
            "source": "Puglia 2023"
        },
        {
            "question": "Qual era la sequenza giornaliera di Paga in Puglia 2023?",
            "options": ["Mi sveglio, mangio e cago", "Mi sveglio, mangio, rutto, cago e bestemmio", "Dormo, mangio, rutto, cago e bestemmio", "Dormo, mangio e cago"],
            "correct": "Mi sveglio, mangio, rutto, cago e bestemmio",
            "source": "Puglia 2023"
        },
        {
            "question": "Come veniva chiamato Ari nelle pagelle Croazia 2024?",
            "options": ["Stanga?Magari", "La Camionista", "La Benzinaia", "In Smartworking"],
            "correct": "Stanga?Magari",
            "source": "Croazia 2024"
        },
        {
            "question": "Quando ha attaccato Ari il virus ai boys prima di andarsene?",
            "options": ["Sardegna", "Puglia", "Crofù", "Croazia"],
            "correct": "Croazia",
            "source": "Croazia 2024"
        },
        {
            "question": "Dove assomigliavano i paesaggi croati secondo Chiara (Amman)?",
            "options": ["Giordania", "Egitto", "Milano Marittima", "Libano"],
            "correct": "Giordania",
            "source": "Croazia 2024"
        },
        {
            "question": "Quante case ha prenotato Paga in Croazia 2024?",
            "options": ["8", "9", "10", "11"],
            "correct": "10",
            "source": "Croazia 2024"
        },
        {
            "question": "Cosa ha lasciato Paga sopra la Polo di Chiara in Croazia 2024?",
            "options": ["Un adesivo", "Della pasta", "Una rigata", "Un rigatone"],
            "correct": "Un rigatone",
            "source": "Croazia 2024"
        },
        {
            "question": "Cosa ha causato un giorno di stop a Paci in Croazia 2024?",
            "options": ["Aria condizionata", "Troppo alcol", "Colpo alla testa", "Cibo avariato"],
            "correct": "Aria condizionata",
            "source": "Croazia 2024"
        },
        {
            "question": "Quante canzoni ascoltava Bax durante le 3 ore di macchina in Croazia 2024?",
            "options": ["3", "5", "7", "10"],
            "correct": "5",
            "source": "Croazia 2024"
        },
        {
            "question": "A chi ha diffuso il Lesgoski Girla in Croazia 2024?",
            "options": ["Ewa", "alle spagnole", "alle croate", "alle finlandesi"],
            "correct": "Lesgoski",
            "source": "Croazia 2024"
        },
        {
            "question": "Quanto costava Mr Dick in Croazia 2024?",
            "options": ["0.7€", "0.9€", "1.7€", "1.9€"],
            "correct": "0.9€",
            "source": "Croazia 2024"
        },
        {
            "question": "Cosa ha mangiato Paga (Si con riso senza lattosio) che ha creato problemi a Ferdi a Capodanno Barcellona?",
            "options": ["Kebab", "Pizza", "Hamburger", "Pasta"],
            "correct": "Kebab",
            "source": "Capodanno Barcellona 2024/25"
        },
        {
            "question": "Cosa sudava Girla a Barcellona 2024/25",
            "options": ["Ascelle", "Culo", "Cipolle", "Mani"],
            "correct": "Cipolle",
            "source": "Capodanno Barcellona 2024/25"
        },
        {
            "question": "Perché Bax è tornato prima in Italia da Capodanno Barcellona?",
            "options": ["Per poter cagare", "Per lavorare", "Per la famiglia", "Per il concerto di PAPA V"],
            "correct": "Per poter cagare",
            "source": "Capodanno Barcellona 2024/25"
        },
        {
            "question": "Cosa faceva continuamente Ceci (La Radiolina) a Capodanno Barcellona?",
            "options": ["Parlava", "Dormiva", "Litigava", "Cantava"],
            "correct": "Parlava",
            "source": "Capodanno Barcellona 2024/25"
        },
        {
            "question": "Cosa è successo a Paci il primo giorno dell'anno a Capodanno Barcellona?",
            "options": ["Febbre", "Sesso", "Vomito", "Lavoro"],
            "correct": "Vomito",
            "source": "Capodanno Barcellona 2024/25"
        },
        {
            "question": "Soprannome Ferdi a Capodanno Barcellona?",
            "options": ["Succhiami il cazzo", "Cazzo dici", "Mi mangio la mela", "Mentecatto"],
            "correct": "Cazzo dici",
            "source": "Capodanno Barcellona 2024/25"
        },
        {
            "question": "Chi ha preso il voto più basso a Barcellona tra questi?",
            "options": ["Marti", "Paci", "Girla", "Paga"],
            "correct": "Paga",
            "source": "Capodanno Barcellona 2024/25"
        },
    ]

    # Se non ci sono abbastanza domande, duplica quelle esistenti
    while len(questions_db) < 200:
        questions_db.extend(questions_db[:200-len(questions_db)])

    # Funzione per ottenere una domanda casuale non usata
    def get_random_question():
        available_questions = [q for q in questions_db if q['question'] not in st.session_state.questions_used]
        if not available_questions:
            return None
        question = random.choice(available_questions)
        st.session_state.questions_used.add(question['question'])
        return question

    # Sezione form per nomi squadre
    if not st.session_state.game_started:
        with st.form(key=f"team_names_{st.session_state.form_key}"):
            st.subheader("Inserisci i nomi delle squadre")
            team1 = st.text_input("Nome Squadra 1", "Squadra 1", key=f"team1_{st.session_state.form_key}")
            team2 = st.text_input("Nome Squadra 2", "Squadra 2", key=f"team2_{st.session_state.form_key}")
            
            if st.form_submit_button("Inizia la partita!"):
                st.session_state.team1_name = team1
                st.session_state.team2_name = team2
                st.session_state.game_started = True
                st.session_state.current_team = 1
                st.session_state.current_question = None
                st.session_state.selected_answer = None
                st.rerun()

    # Gioco in corso
    if st.session_state.game_started and not st.session_state.game_over:
        st.header(f"{st.session_state.team1_name} vs {st.session_state.team2_name}")
        col1, col2 = st.columns(2)
        with col1:
            st.metric(label=st.session_state.team1_name, value=st.session_state.team1_score)
        with col2:
            st.metric(label=st.session_state.team2_name, value=st.session_state.team2_score)
        
        st.subheader(f"Turno della {st.session_state.team1_name if st.session_state.current_team == 1 else st.session_state.team2_name}")
        
        # Mostra domanda corrente o ne genera una nuova
        if st.session_state.current_question is None:
            st.session_state.current_question = get_random_question()
            if st.session_state.current_question is None:
                st.session_state.game_over = True
                st.rerun()
        
        if st.session_state.current_question:
            st.markdown(f"**Domanda {st.session_state.question_count + 1}/20**")
            st.markdown(f"*{st.session_state.current_question['source']}*")
            st.markdown(f"### {st.session_state.current_question['question']}")
            
            # Mostra opzioni di risposta
            options = st.session_state.current_question['options']
            correct_answer = st.session_state.current_question['correct']
            
            cols = st.columns(2)
            for i, option in enumerate(options):
                with cols[i % 2]:
                    question_hash = hash(st.session_state.current_question['question'])
                    unique_key = f"option_{i}_{question_hash}"
                    if st.button(option, key=unique_key, use_container_width=True):
                        st.session_state.selected_answer = option
                        if option == correct_answer:
                            if st.session_state.current_team == 1:
                                st.session_state.team1_score += 1
                            else:
                                st.session_state.team2_score += 1
            
            # Mostra risultato e passa alla domanda successiva
            if st.session_state.selected_answer is not None:
                if st.session_state.selected_answer == correct_answer:
                    st.success(f"✅ Esatto! La risposta corretta è: {correct_answer}")
                else:
                    st.error(f"❌ Sbagliato! La risposta corretta è: {correct_answer}")
                
                if st.button("Prossima domanda", key=f"next_{st.session_state.question_count}"):
                    st.session_state.question_count += 1
                    st.session_state.current_question = None
                    st.session_state.selected_answer = None
                    st.session_state.current_team = 2 if st.session_state.current_team == 1 else 1
                    
                    if st.session_state.question_count >= 20:
                        st.session_state.game_over = True
                    st.rerun()
    
    # Fine partita
    if st.session_state.game_over:
        st.balloons()
        st.header("🏆 Partita Terminata! 🏆")
        
        if st.session_state.team1_score > st.session_state.team2_score:
            st.success(f"Vince la {st.session_state.team1_name} con {st.session_state.team1_score} punti!")
        elif st.session_state.team2_score > st.session_state.team1_score:
            st.success(f"Vince la {st.session_state.team2_name} con {st.session_state.team2_score} punti!")
        else:
            st.info(f"Pareggio! Entrambe le squadre hanno totalizzato {st.session_state.team1_score} punti.")
        
        col1, col2 = st.columns(2)
        with col1:
            st.metric(label=st.session_state.team1_name, value=st.session_state.team1_score)
        with col2:
            st.metric(label=st.session_state.team2_name, value=st.session_state.team2_score)
        
        if st.button("Rigioca", key=f"restart_{st.session_state.restart_key}"):
            # Resetta solo le variabili di gioco, mantenendo i nomi delle squadre e lo stato inizializzato
            st.session_state.questions_used = set()
            st.session_state.team1_score = 0
            st.session_state.team2_score = 0
            st.session_state.current_question = None
            st.session_state.current_team = 1
            st.session_state.question_count = 0
            st.session_state.game_over = False
            st.session_state.selected_answer = None
            st.session_state.game_started = True  # Rimani nella modalità di gioco
            st.session_state.restart_key = str(random.randint(0, 1000000))  # Aggiorna la chiave
            st.rerun()


###################################################################################################################

def game_2():
    def display_game_board():
        st.subheader("Punteggi attuali")
        cols = st.columns(len(st.session_state.players))
        for i, (player, score) in enumerate(st.session_state.scores.items()):
            cols[i].metric(player, score)

        st.markdown("---")
        
        current_player = st.session_state.players[st.session_state.current_player]
        st.subheader(f"Turno di: {current_player}")

        # Mostra la griglia di gioco
        grid_cols = st.columns(5)
        for i, category in enumerate(st.session_state.categories):
            with grid_cols[i]:
                st.markdown(f"**{category}**")
                for j, value in enumerate([100, 200, 300, 400, 500]):
                    if (i, j) not in st.session_state.answered_questions:
                        st.button(f"{value}", key=f"q_{i}_{j}", 
                                 on_click=select_question, args=(i,j))
                    else:
                        st.button(f"{value}", disabled=True, key=f"disabled_{i}_{j}",
                                help="Domanda già selezionata",
                                type="secondary")

    def select_question(i, j):
        st.session_state.current_question = (i, j)
        st.session_state.show_answer = False
        st.session_state.needs_rerun = True

    def display_question_screen():
        i, j = st.session_state.current_question
        question_data = st.session_state.questions[(i, j)]
        
        with st.container():
            st.markdown(f"### Categoria: {question_data['category']}")
            st.markdown(f"### Valore: {question_data['value']} punti")
            st.markdown("---")
            st.markdown(f"## {question_data['question']}")
            
            if not st.session_state.show_answer:
                st.button("Vedi risposta", on_click=show_answer)
            else:
                st.markdown("---")
                st.markdown(f"## Risposta: {question_data['answer']}")
                st.markdown("---")
                st.markdown("### Hai indovinato?")
                
                col1, col2 = st.columns(2)
                with col1:
                    st.button("Sì", key="correct", on_click=answer_question, args=(True,))
                with col2:
                    st.button("No", key="incorrect", on_click=answer_question, args=(False,))

    def show_answer():
        st.session_state.show_answer = True
        st.session_state.needs_rerun = True

    def answer_question(correct):
        i, j = st.session_state.current_question
        question_data = st.session_state.questions[(i, j)]
        current_player = st.session_state.players[st.session_state.current_player]
        
        if correct:
            st.session_state.scores[current_player] += question_data['value']
        else:
            st.session_state.scores[current_player] -= question_data['value']
        
        st.session_state.answered_questions.add(st.session_state.current_question)
        st.session_state.current_question = None
        st.session_state.show_answer = False
        
        total_questions = 5 * 5
        max_questions = calculate_max_questions(len(st.session_state.players))
        
        if len(st.session_state.answered_questions) >= max_questions or len(st.session_state.answered_questions) == total_questions:
            st.session_state.game_over = True
            st.session_state.needs_rerun = True
        else:
            num_players = len(st.session_state.players)
            st.session_state.current_player = (st.session_state.current_player + 1) % num_players
            st.session_state.needs_rerun = True

    def display_final_results():
        with st.container():
            st.markdown("# Gioco terminato!")
            st.markdown("## Classifica finale:")
            
            sorted_scores = sorted(st.session_state.scores.items(), key=lambda item: item[1], reverse=True)
            
            for i, (player, score) in enumerate(sorted_scores):
                st.markdown(f"### {i+1}. **{player}**: {score} punti")
            
            st.markdown("---")
            if st.button("Gioca con un nuovo personaggio"):
                # Resetta solo lo stato necessario per tornare all'inizio
                st.session_state.game_started = False
                st.session_state.game_over = False
                st.session_state.needs_rerun = True

    def calculate_max_questions(num_players):
        if num_players in [1, 4, 5]:
            return 25
        elif num_players in [2, 3, 6, 8]:
            return 24
        elif num_players == 7:
            return 21
        return 25
    
    # Inizializzazione completa dello stato della sessione
    if 'game_started' not in st.session_state:
        st.session_state.game_started = False
        st.session_state.players = []
        st.session_state.scores = {}
        st.session_state.answered_questions = set()
        st.session_state.current_question = None
        st.session_state.show_answer = False
        st.session_state.game_over = False
        st.session_state.selected_character = None
        st.session_state.categories = []
        st.session_state.questions = {}
        st.session_state.current_player = 0
        st.session_state.needs_rerun = False

    # Gestione del rerun
    if st.session_state.get('needs_rerun', False):
        st.session_state.needs_rerun = False
        st.rerun()

    st.title("Jeopardy")
    
    # Spiegazione del gioco (solo se il gioco non è iniziato)
    if not st.session_state.game_started or st.session_state.game_over:
        if st.session_state.game_over:
            # Se siamo qui perché il gioco è finito, mostriamo prima i risultati
            display_final_results()
            return
        
        # Altrimenti mostriamo la schermata iniziale
        st.markdown("""
        <div style="color: var(--text-secondary); margin-bottom: 3rem; line-height: 1.7; font-size: 1.1rem;">
            <h3>Benvenuti a Jeopardy!</h3>
            <p>Le regole sono semplici:</p>
            <ol>
                <li>Scegli il personaggio su cui vuoi giocare</li>
                <li>Scegli il numero di giocatori e inserisci i loro nomi</li>
                <li>A turno, ogni giocatore sceglie una casella con domanda</li>
                <li>Il numero sulla domanda indica quanto vinciamo o perdiamo in base alla nostra risposta</li>
                <li>Leggi la domanda e prova a rispondere</li>
                <li>Dopo aver visto la risposta, indica se hai indovinato</li>
                <li>Il gioco continua finché tutte le caselle disponibili sono state giocate</li>
                <li>Alla fine vedrai la classifica finale!</li>
            </ol>
        </div>
        """, unsafe_allow_html=True)

        # Personaggi disponibili
        characters = {
            "Girla": ["Categoria 1", "Categoria 2", "Categoria 3", "Categoria 4", "Categoria 5"],
            "Paci": None,
            "Paga": None,
            "Bax": None,
            "Chiara": None,
            "Ceci": None,
            "Gaia": None,
            "Ari": None
        }

        # Seleziona personaggio
        selected_character = st.selectbox("Seleziona il personaggio su cui vuoi giocare", list(characters.keys()))

        if characters[selected_character] is None and selected_character != "Girla":
            st.error(f"Scusa, il gioco per {selected_character} non è ancora stato creato!")
            if st.button("Torna alla selezione"):
                st.session_state.needs_rerun = True
            return

        # Numero di giocatori
        num_players = st.number_input("In quanti volete giocare? (1-8)", min_value=1, max_value=8, value=1, step=1)

        # Nomi dei giocatori
        players = []
        for i in range(num_players):
            player_name = st.text_input(f"Nome giocatore {i+1}", value=f"Giocatore {i+1}")
            players.append(player_name)

        if not all(players):
            st.warning("Per favore, inserisci un nome per ogni giocatore")
            return

        if st.button("Inizia il gioco!"):
            st.session_state.game_started = True
            st.session_state.game_over = False
            st.session_state.players = players
            st.session_state.scores = {player: 0 for player in players}
            st.session_state.selected_character = selected_character
            st.session_state.current_player = 0
            st.session_state.answered_questions = set()

            # Domande predefinite per Girla
            if selected_character == "Girla":
                categories = ["Generale", "Amore", "Scuola", "Viaggi", "Cibo"] 
                questions = {
                    # Categoria 1
                    (0, 0): {
                        "category": categories[0],
                        "value": 100,
                        "question": "Quando è nato?",
                        "answer": "23 Marzo 2001"
                    },
                    (0, 1): {
                        "category": categories[0],
                        "value": 200,
                        "question": "Come si chiamava il suo coniglio?",
                        "answer": "Willy"
                    },
                    (0, 2): {
                        "category": categories[0],
                        "value": 300,
                        "question": "In che squadra giocava il mio bisnonno materno?",
                        "answer": "Milan (+ Cagliari, GC Vigevanesi, Sempre Avanti)"
                    },
                    (0, 3): {
                        "category": categories[0],
                        "value": 400,
                        "question": "Quando (mese e anno) mi sono fatto la pelata (margine di errore 3 mesi)? ",
                        "answer": "Maggio 2022"
                    },
                    (0, 4): {
                        "category": categories[0],
                        "value": 500,
                        "question": "Chi, quando e perchè ha iniziato a chiamarmi 'Girla'?",
                        "answer": "Allenatore di Calcio, elementari, per non confondermi con Luca Cesari "
                    },
                    
                    # Categoria 2
                    (1, 0): {
                        "category": categories[1],
                        "value": 100,
                        "question": "Preferisce more o bionde? Occhi chiari o occhi scuri?",
                        "answer": "More - occhi chiari (è così da prima che incontrassi Ewa!)"
                    },
                    (1, 1): {
                        "category": categories[1],
                        "value": 200,
                        "question": "Quante tipe si è fatto in discoteca?",
                        "answer": "0"
                    },
                    (1, 2): {
                        "category": categories[1],
                        "value": 300,
                        "question": "Quante relazioni ufficiali (no scuola elementare) ha avuto e come si chiamavano le ragazze?",
                        "answer": "3: Chiara(non Verpelli), Letizia ed Ewa"
                    },
                    (1, 3): {
                        "category": categories[1],
                        "value": 400,
                        "question": "Dimmi il nome/soprannome delle TRE 'situationship' (no relazioni) avute",
                        "answer": "Maria Luisa Montale (Lully/Malumore), Alessia (la russa) e Lucia"
                    },
                    (1, 4): {
                        "category": categories[1],
                        "value": 500,
                        "question": "Dopo varie relazioni/situationship quale caratteristica sembra presentarsi maggiormente nelle ragazze trovate?",
                        "answer": "Problemi con il padre :)"
                    },
                    
                    # Categoria 3
                    (2, 0): {
                        "category": categories[2],
                        "value": 100,
                        "question": "Cosa vado a studiare a Londra:",
                        "answer": "Quantitative Finance (with Data Science, ve lo abbono)"
                    },
                    (2, 1): {
                        "category": categories[2],
                        "value": 200,
                        "question": "Voto in triennale (margine di errore: 2 punti)",
                        "answer": "96"
                    },
                    (2, 2): {
                        "category": categories[2],
                        "value": 300,
                        "question": "Quanti debiti ha preso al liceo(4-6-8-10)?",
                        "answer": "8"
                    },
                    (2, 3): {
                        "category": categories[2],
                        "value": 400,
                        "question": "Voto di maturità (margine di errore: 1 punto)",
                        "answer": "64"
                    },
                    (2, 4): {
                        "category": categories[2],
                        "value": 500,
                        "question": "Quante internship ho fatto (periodo triennale) e in quante associazioni universitarie sono stato(periodo magistrale)?",
                        "answer": "2 internship (FinecoBank e Invesco Asset Management) e 2 associazioni (Starting Finance Bicocca e Miura) "
                    },
                    
                    # Categoria 4
                    (3, 0): {
                        "category": categories[3],
                        "value": 100,
                        "question": "Viaggio dei sogni?",
                        "answer": "Giappone"
                    },
                    (3, 1): {
                        "category": categories[3],
                        "value": 200,
                        "question": "In quali due posti sono sempre andato in vacanza",
                        "answer": "Alassio e Grottammare/San Benedetto del Tronto"
                    },
                    (3, 2): {
                        "category": categories[3],
                        "value": 300,
                        "question": "Prima vacanza con AP88 (luogo, anno e occasione)?",
                        "answer": "Capodanno Roma 2019"
                    },
                    (3, 3): {
                        "category": categories[3],
                        "value": 400,
                        "question": "Quali di queste città non ho mai visitato (Madrid, Parigi, Monaco, Vienna)? ",
                        "answer": "Madrid, Parigi e Monaco"
                    },
                    (3, 4): {
                        "category": categories[3],
                        "value": 500,
                        "question": "Da quale regione arriva il cognome Girlando",
                        "answer": "Sicilia"
                    },

                    # Categoria 5
                    (4, 0): {
                        "category": categories[4],
                        "value": 100,
                        "question": "Pizza Preferita?",
                        "answer": "Diavola"
                    },
                    (4, 1): {
                        "category": categories[4],
                        "value": 200,
                        "question": "Drink preferito? Vino rosso o vino bianco?",
                        "answer": "Moscow Mule, vino rosso"
                    },
                    (4, 2): {
                        "category": categories[4],
                        "value": 300,
                        "question": "Cioccolato bianco, al latte o fondente? Formaggio sulla pasta al sugo si o no?",
                        "answer": "Fondente, no!"
                    },
                    (4, 3): {
                        "category": categories[4],
                        "value": 400,
                        "question": "Gin o Vodka? Lemon o Tonic? The alla Pesca o al Limone? Gorgonzola o Pecorino?",
                        "answer": "Gin, Tonic, the alla Pesca, Gorgonzola"
                    },
                    (4, 4): {
                        "category": categories[4],
                        "value": 500,
                        "question": "Carne o pesce? Dolce o salato? Carbonara o cacio e pepe? Tette o culo? Prima il latte o prima i cereali?",
                        "answer": "Pesce, salato, cacio e pepe, culo, prima i cereali"
                    },

                }
                st.session_state.questions = questions
                st.session_state.categories = categories

            st.session_state.needs_rerun = True

    else:
        # Gioco iniziato - mostra la schermata corretta
        if st.session_state.current_question is not None or st.session_state.show_answer:
            display_question_screen()
        else:
            display_game_board()



###################################################################################################################

def game_3():
    st.title("Chi è il più predisposto a...?")
    
    # Presentazione delle regole del gioco
    st.markdown("""
    <div style="background-color: #ff4b4b; padding: 1.5rem; border-radius: 10px; margin-bottom: 2rem; color: white;">
        <h3 style="margin-top: 0;">⚠️ REGOLE DEL GIOCO (18+) ⚠️</h3>
        <ol style="line-height: 1.7; font-size: 1.1rem;">
            <li>Inserite i nomi dei partecipanti (da 2 a 10)</li>
            <li>Apparirà una domanda <strong>SPIETATA</strong> tipo "Chi è il più predisposto a..."</li>
            <li>Votate in <strong>SEGRETO</strong> il "fortunato" partecipante</li>
            <li><strong>NON RIVELATE</strong> mai il vostro voto!</li>
            <li>Scoprite i risultati anonimi e <strong>DISCUTETENE</strong> fino a litigare!</li>
            <li>Chi sopravvive passa alla prossima domanda...</li>
        </ol>
    </div>
    """, unsafe_allow_html=True)
    
    # Lista di 100 FRASI ESTREME per il gioco
    frasi = [
        # Sessuali/Piccanti
        "Chi è il più predisposto a tradire il partner durante un viaggio?",
        "Chi è il più predisposto a fare sesso in un luogo pubblico?",
        "Chi è il più predisposto a provare un menage à trois?",
        "Chi è il più predisposto a farsi trovare nudo in una situazione imbarazzante?",
        "Chi è il più predisposto a scrivere un libro erotico?",
        "Chi è il più predisposto a fare onlyfans?",
        "Chi è il più predisposto a fare uno strip-tease improvvisato?",
        "Chi è il più predisposto a mandare un nudo per sbaglio?",
        "Chi è il più predisposto a finire su un sito porno?",
        "Chi è il più predisposto a fare sesso con un robot?",
        
        # Imbarazzanti
        "Chi è il più predisposto a farsi arrestare per qualcosa di stupido?",
        "Chi è il più predisposto a piangere durante un film Disney?",
        "Chi è il più predisposto a farsi beccare a parlare da solo?",
        "Chi è il più predisposto a fare una scoreggia durante un primo appuntamento?",
        "Chi è il più predisposto a cadere in diretta TV?",
        "Chi è il più predisposto a farsi bannare dai social per un commento stupido?",
        "Chi è il più predisposto a vomitare dopo un giro sulle montagne russe?",
        "Chi è il più predisposto a farsi scoprire con un feticcio bizzarro?",
        "Chi è il più predisposto a dire 'ti amo' durante il primo appuntamento?",
        "Chi è il più predisposto a farsi beccare a cantare davanti allo specchio?",
        
        # Crimini/Scandali
        "Chi è il più predisposto a finire in prigione?",
        "Chi è il più predisposto a diventare un criminale internazionale?",
        "Chi è il più predisposto a fare insider trading?",
        "Chi è il più predisposto a essere coinvolto in uno scandalo politico?",
        "Chi è il più predisposto a rubare in un negozio?",
        "Chi è il più predisposto a diventare un hacker?",
        "Chi è il più predisposto a falsificare un documento?",
        "Chi è il più predisposto a fare evasione fiscale?",
        "Chi è il più predisposto a diventare un boss mafioso?",
        "Chi è il più predisposto a corrompere un poliziotto?",
        
        # Relazioni tossiche
        "Chi è il più predisposto a tornare con l'ex (anche se è tossico)?",
        "Chi è il più predisposto a fare stalking?",
        "Chi è il più predisposto a farsi bloccare su WhatsApp?",
        "Chi è il più predisposto a scrivere un messaggio ubriaco all'ex?",
        "Chi è il più predisposto a innamorarsi di una escort?",
        "Chi è il più predisposto a sposarsi dopo una settimana?",
        "Chi è il più predisposto a divorziare dopo un mese?",
        "Chi è il più predisposto a farsi catfisherare?",
        "Chi è il più predisposto a farsi stalkerare da un fan?",
        "Chi è il più predisposto a farsi ghostare?",
        
        # Futuro distopico
        "Chi è il più predisposto a diventare un senzatetto?",
        "Chi è il più predisposto a vivere in un bunker?",
        "Chi è il più predisposto a farsi clonare?",
        "Chi è il più predisposto a farsi criocongelare?",
        "Chi è il più predisposto a diventare un cyborg?",
        "Chi è il più predisposto a farsi impiantare un chip nel cervello?",
        "Chi è il più predisposto a combattere in una guerra futura?",
        "Chi è il più predisposto a vivere su Marte?",
        "Chi è il più predisposto a essere sostituito da un robot?",
        "Chi è il più predisposto a diventare uno schiavo delle IA?",
        
        # Divertenti/Assurde
        "Chi è il più predisposto a diventare un culturista over 50?",
        "Chi è il più predisposto a vincere un reality show trash?",
        "Chi è il più predisposto a mangiare insetti per soldi?",
        "Chi è il più predisposto a farsi un tatuaggio orribile?",
        "Chi è il più predisposto a diventare un rapper fallito?",
        "Chi è il più predisposto a fare un corso di clown terapia?",
        "Chi è il più predisposto a credere alla terra piatta?",
        "Chi è il più predisposto a farsi truffare da una medium?",
        "Chi è il più predisposto a comprare un corso su come diventare ricco?",
        "Chi è il più predisposto a farsi convincere a entrare in una setta?",
        
        # Vita sociale imbarazzante
        "Chi è il più predisposto a presentarsi ubriaco a un matrimonio?",
        "Chi è il più predisposto a rovinare una festa?",
        "Chi è il più predisposto a dire la cosa sbagliata al momento sbagliato?",
        "Chi è il più predisposto a essere quello scomodo a cena?",
        "Chi è il più predisposto a farsi odiare dai suoceri?",
        "Chi è il più predisposto a litigare per un like mancato?",
        "Chi è il più predisposto a farsi licenziare per un post su Facebook?",
        "Chi è il più predisposto a essere quello che non viene invitato?",
        "Chi è il più predisposto a finire su un video imbarazzante virale?",
        "Chi è il più predisposto a fare coming out dopo i 50 anni?",
        
        # Vita privata scandalosa
        "Chi è il più predisposto a farsi beccare su Tinder mentre è in una relazione?",
        "Chi è il più predisposto a farsi scoprire con un profilo fake?",
        "Chi è il più predisposto a fare sesso con un collega?",
        "Chi è il più predisposto a farsi beccare a guardare porno?",
        "Chi è il più predisposto a fare sexting con lo sconosciuto sbagliato?",
        "Chi è il più predisposto a farsi ricattare con un video hot?",
        "Chi è il più predisposto a fare un figlio segreto?",
        "Chi è il più predisposto a farsi un amante?",
        "Chi è il più predisposto a farsi stalkerare dall'ex?",
        "Chi è il più predisposto a finire al Jerry Springer Show?",
        
        # Abitudini disgustose
        "Chi è il più predisposto a non lavarsi per una settimana?",
        "Chi è il più predisposto a mangiare cibo scaduto?",
        "Chi è il più predisposto a fare pipì nella doccia?",
        "Chi è il più predisposto a usare la stessa biancheria per giorni?",
        "Chi è il più predisposto a non pulire il bagno?",
        "Chi è il più predisposto a mangiarsi le unghie dei piedi?",
        "Chi è il più predisposto a russare come un trattore?",
        "Chi è il più predisposto a scoreggiare sotto le coperte?",
        "Chi è il più predisposto a bere dal cartone del latte?",
        "Chi è il più predisposto a mangiare il proprio moccio?",
        
        # Scelte di vita discutibili
        "Chi è il più predisposto a investire in crypto e perdere tutto?",
        "Chi è il più predisposto a sposare una gold digger?",
        "Chi è il più predisposto a farsi un lifting horror?",
        "Chi è il più predisposto a comprare un cane e poi abbandonarlo?",
        "Chi è il più predisposto a farsi un tatuaggio del nome dell'amante?",
        "Chi è il più predisposto a farsi truffare da una fake charity?",
        "Chi è il più predisposto a diventare un influencer cringe?",
        "Chi è il più predisposto a fare un corso su come parlare con gli alieni?",
        "Chi è il più predisposto a comprare un corso di seduzione?",
        "Chi è il più predisposto a farsi convincere a fare un reality show?"
    ]
    
    # Inizializzazione dello stato della sessione
    if 'partecipanti' not in st.session_state:
        st.session_state.partecipanti = []
        st.session_state.frasi_usate = []
        st.session_state.frase_corrente = ""
        st.session_state.voti = {}
        st.session_state.fase_gioco = "setup"  # "setup", "votazione", "risultati"
        st.session_state.giocatore_corrente = 0
        st.session_state.voti_totali = {}
    
    # Fase di setup: inserimento partecipanti
    if st.session_state.fase_gioco == "setup":
        st.markdown("### 🔥 Inserisci i nomi dei partecipanti (preparatevi al peggio)")
        with st.form("setup_form"):
            num_partecipanti = st.slider("Numero di partecipanti", 2, 10, 4, 
                                        help="Più siete, più sarà divertente (e drammatico)!")
            partecipanti = []
            
            for i in range(num_partecipanti):
                nome = st.text_input(f"Nome partecipante {i+1}", key=f"partecipante_{i}",
                                   placeholder="Scrivi qui il nome...")
                partecipanti.append(nome)
            
            if st.form_submit_button("🚀 INIZIA IL GIOCO (a tuo rischio e pericolo!)"):
                if all(partecipanti):
                    st.session_state.partecipanti = partecipanti
                    st.session_state.fase_gioco = "votazione"
                    st.session_state.voti_totali = {nome: 0 for nome in partecipanti}
                    # Scegli una frase casuale non usata
                    frasi_disponibili = [f for f in frasi if f not in st.session_state.frasi_usate]
                    if frasi_disponibili:
                        st.session_state.frase_corrente = random.choice(frasi_disponibili)
                        st.session_state.frasi_usate.append(st.session_state.frase_corrente)
                    else:
                        st.session_state.fase_gioco = "fine_gioco"
                else:
                    st.error("ATTENZIONE: Devi inserire un nome per ogni partecipante!")

    # Fase di votazione
    elif st.session_state.fase_gioco == "votazione":
        st.markdown(f"""
        <div style="background-color: #ff4b4b; color: white; padding: 2rem; border-radius: 10px; margin-bottom: 2rem; text-align: center;">
            <h1 style="margin: 0; font-size: 2rem;">🔥 {st.session_state.frase_corrente} 🔥</h1>
        </div>
        """, unsafe_allow_html=True)
        
        st.markdown(f"""
        <div style="background-color: #ffdddd; padding: 1rem; border-radius: 10px; margin-bottom: 1rem; text-align: center;">
            <h3 style="color: #d80000;">✋ È IL TURNO DI: <strong>{st.session_state.partecipanti[st.session_state.giocatore_corrente].upper()}</strong></h3>
            <p style="color: #d80000;">(Gli altri giratevi e NON GUARDATE!)</p>
        </div>
        """, unsafe_allow_html=True)
        
        with st.form(f"voto_form_{st.session_state.giocatore_corrente}"):  # Form unico per ogni giocatore
            # Usiamo un key dinamica basata sull'indice del giocatore
            voto = st.radio("Scegli la tua vittima:", 
                          st.session_state.partecipanti, 
                          key=f"voto_radio_{st.session_state.giocatore_corrente}",
                          index=None)  # Nessuna selezione di default
            
            if st.form_submit_button("💣 CONFERMA IL TUO VOTO (NON DIRLO A NESSUNO!)"):
                if voto:
                    st.session_state.voti[st.session_state.partecipanti[st.session_state.giocatore_corrente]] = voto
                    st.session_state.giocatore_corrente += 1
                    
                    if st.session_state.giocatore_corrente >= len(st.session_state.partecipanti):
                        st.session_state.fase_gioco = "risultati"
                        st.session_state.giocatore_corrente = 0
                        # Aggiorna i voti totali
                        for votante, votato in st.session_state.voti.items():
                            st.session_state.voti_totali[votato] += 1
                    st.rerun()
                else:
                    st.warning("Devi scegliere qualcuno!")

    # Fase di risultati
    elif st.session_state.fase_gioco == "risultati":
        st.markdown(f"""
        <div style="background-color: #ff4b4b; color: white; padding: 2rem; border-radius: 10px; margin-bottom: 2rem; text-align: center;">
            <h1 style="margin: 0; font-size: 2rem;">🔥 {st.session_state.frase_corrente} 🔥</h1>
        </div>
        """, unsafe_allow_html=True)
        
        st.markdown("### 📊 RISULTATI DELLA VOTAZIONE (ANONIMI... FORSE)")
        
        # Creazione del grafico
        df = pd.DataFrame({
            "Partecipante": list(st.session_state.voti_totali.keys()),
            "Voti": list(st.session_state.voti_totali.values())
        }).sort_values("Voti", ascending=False)
        
        fig, ax = plt.subplots(figsize=(10, 6))
        bars = ax.barh(df["Partecipante"], df["Voti"], color='#ff4b4b')
        ax.set_xlabel('Voti ricevuti (più voti = più problemi)')
        ax.set_title('CHI È FINITO NEL TRITACARNE?')
        
        # Aggiungi il numero di voti alla fine di ogni barra
        for bar in bars:
            width = bar.get_width()
            ax.text(width + 0.1, bar.get_y() + bar.get_height()/2, f'{int(width)}', 
                    ha='left', va='center', fontweight='bold')
        
        st.pyplot(fig)
        
        # Mostra i voti in dettaglio (per il dramma)
        with st.expander("💀 DETTAGLIO VOTI (per litigare meglio)"):
            st.write("Ecco chi ha votato chi (ma non dovresti guardare!):")
            voti_df = pd.DataFrame({
                "Votante": st.session_state.voti.keys(),
                "Ha votato": st.session_state.voti.values()
            })
            st.dataframe(voti_df.style.highlight_max(axis=0, color='#ffcccc'), 
                        use_container_width=True, hide_index=True)
        
        # Controlla se ci sono ancora frasi disponibili
        frasi_disponibili = [f for f in frasi if f not in st.session_state.frasi_usate]
        
        col1, col2 = st.columns(2)
        with col1:
            if frasi_disponibili:
                if st.button("💥 PROSSIMA DOMANDA (ancora più pesante)", use_container_width=True):
                    st.session_state.frase_corrente = random.choice(frasi_disponibili)
                    st.session_state.frasi_usate.append(st.session_state.frase_corrente)
                    st.session_state.voti = {}
                    st.session_state.fase_gioco = "votazione"
                    st.rerun()
            else:
                st.warning("Hai finito tutte le domande... mi dispiace o sono felice?")
        
        with col2:
            if st.button("☠️ NUOVA PARTITA (per chi ha coraggio)", use_container_width=True):
                st.session_state.partecipanti = []
                st.session_state.frasi_usate = []
                st.session_state.frase_corrente = ""
                st.session_state.voti = {}
                st.session_state.fase_gioco = "setup"
                st.session_state.giocatore_corrente = 0
                st.session_state.voti_totali = {}
                st.rerun()
    
    # Fase di fine gioco (domande finite)
    elif st.session_state.fase_gioco == "fine_gioco":
        st.markdown("""
        <div style="background-color: #ff4b4b; padding: 3rem; border-radius: 10px; text-align: center; color: white;">
            <h1 style="font-size: 2.5rem;">💀 GAME OVER 💀</h1>
            <p style="font-size: 1.5rem;">Avete sopravvissuto a TUTTE le domande!</p>
            <p style="font-size: 1.2rem;">Spero che vi siano rimasti ancora degli amici...</p>
        </div>
        """, unsafe_allow_html=True)
        
        # Mostra i risultati finali
        st.markdown("### 🏆 CLASSIFICA FINALE (DEI PIÙ TRAUMATIZZATI)")
        df_finale = pd.DataFrame({
            "Partecipante": list(st.session_state.voti_totali.keys()),
            "Voti totali": list(st.session_state.voti_totali.values())
        }).sort_values("Voti totali", ascending=False)
        
        st.dataframe(df_finale.style.apply(lambda x: [
            'background-color: #ffcccc' if x.name == df_finale["Voti totali"].idxmax() 
            else '' for i in x], axis=1), 
                    use_container_width=True, height=(len(df_finale) + 1) * 35 + 3)
        
        st.balloons()
        
        if st.button("🔄 RICOMINCIA DA CAPO (se osi)", use_container_width=True):
            st.session_state.partecipanti = []
            st.session_state.frasi_usate = []
            st.session_state.frase_corrente = ""
            st.session_state.voti = {}
            st.session_state.fase_gioco = "setup"
            st.session_state.giocatore_corrente = 0
            st.session_state.voti_totali = {}
            st.rerun()

###################################################################################################################

def finanza_page():
    # Titolo e introduzione
    st.title("💰 Finanza Personale")
    st.markdown("""
    <style>
    .big-font { font-size:1.2rem !important; }
    .metric-box { 
        background-color:#000000; 
        border-radius:10px; 
        padding:20px; 
        margin-bottom:30px; 
        color: white !important; 
    }
    .metric-title { 
        font-size:1.3rem; 
        font-weight:bold; 
        margin-bottom:15px; 
        color: white !important; 
    }
    .metric-value { 
        font-size:1.5rem; 
        font-weight:bold; 
        color: white !important; 
    }
    .metric-label { 
        font-size:0.9rem; 
        color: white !important; 
    }
    .metric-explanation {
        font-size:0.8rem;
        color: #cccccc !important;
        margin-top:5px;
    }
    .black-text { color: black !important; }
    .stDataFrame td { color: black !important; }
    .stDataFrame th { color: black !important; }
    .conservative {
       background-color: #616161;  /* Grigio scuro */
       padding: 10px;
       border-radius: 5px;
       margin-bottom: 15px;
       color: white !important;  /* Testo bianco per contrasto */
    }
    </style>
    """, unsafe_allow_html=True)
    
    st.markdown("""
    <div class='big-font'>
    Ho aggiunto questa noiosa sezione, perchè sono sicuro che farete tanti soldi nelle vostre vite e non vorrei mai che, inconsapevolmente, ve li lasciate mangiare dall'inflazione, dalle banche o da consulenti (promotori) finanziari. 
    </div>
    """, unsafe_allow_html=True)
    
    # Materiale didattico
    with st.container():
        st.header("📚 Materiale Didattico")
        col1, col2 = st.columns([3,1])
        
        with col1:
            st.markdown("""
            Qui di seguito trovate una videolezione + slides di un evento di Finanza Personale che ho organizzato in Bicocca con Starting Finance. Sono meno di 2 orette e mezza (togliendo intro e outro), ma vi assicuro che ne vale la pena per capire:
            - Perché ha senso investire
            - Come superare le paure
            - Cosa **NON** fare assolutamente
            - Strumenti disponibili
            - Come valutare le opportunità
            - Fondi pensione e tassazione
            """)
            
            st.info("""
            Vi consiglio di guardarlo e di farvi le vostre idee (anche cercando altre informazioni altrove), ma mi raccomando non abbiate paura a mettere in dubbio gli investimenti che stanno facendo i vostri genitori, il vostro consulente o la vostra banca, perchè negli ultimi anni molte cose sono cambiate, ma molti sono rimasti indietro.
            """)
            
            # Link al video di Google Drive
            st.markdown("""
            [▶️ Guarda la videolezione completa (Google Drive)](https://drive.google.com/file/d/1Y1f8RXeEE0U309EcZJ6cqGZUZwFAB_MF/view)
            """)
        
        with col2:
            with open("Investire senza trappole.pdf", "rb") as pdf_file:
                st.download_button(
                    label="📥 Scarica le slides",
                    data=pdf_file.read(),
                    file_name="Investire_senza_trappole.pdf",
                    mime="application/pdf"
                )
    
    st.markdown("---")
    
    # Simulatore di investimento
    st.header("🧮 Simulatore di Investimento")
    st.markdown("""
    <div class='big-font'>
    Scopri come gli investimenti possono crescere nel tempo. Modifica i parametri e osserva i risultati.
    </div>
    """, unsafe_allow_html=True)
    
    # Input parametri con valori di default modificati
    with st.expander("⚙️ Configura i parametri", expanded=True):
        c1, c2, c3, c4 = st.columns(4)
        with c1:
            initial_capital = st.number_input("💰 **Capitale iniziale**", 
                                            min_value=0, 
                                            value=0, 
                                            step=1000)
        with c2:
            monthly_investment = st.number_input("💵 **Investimento mensile**", 
                                              min_value=0, 
                                              value=100, 
                                              step=50)
        with c3:
            years = st.slider("⏳ **Orizzonte temporale (anni)**", 
                            min_value=5, 
                            max_value=60, 
                            value=50)
        with c4:
            annual_return = st.slider("📈 **Rendimento annuo atteso**", 
                                   min_value=0.0, 
                                   max_value=15.0, 
                                   value=6.0, 
                                   step=0.5)
            
            st.markdown("""
            <div class='conservative'>
            <b>Nota:</b> Il 6% è una stima molto conservativa. Dal 1926 il mercato americano (S&P 500) ha reso oltre il 10.5% annuo e negli ultimi 10 anni oltre il 12.5% annuo.
            </div>
            """, unsafe_allow_html=True)
    
    inflation = st.slider("💸 **Inflazione annua attesa**", 
                         min_value=0.0, 
                         max_value=10.0, 
                         value=2.75, 
                         step=0.25)
    
    # Calcoli
    months = years * 12
    monthly_return = (1 + annual_return/100)**(1/12) - 1
    monthly_inflation = (1 + inflation/100)**(1/12) - 1

    # Simulazione
    capital = initial_capital
    invested = initial_capital
    real_value = initial_capital
    inflation_loss = initial_capital
    
    history = []
    for month in range(1, months + 1):
        capital += monthly_investment
        invested += monthly_investment
        capital *= (1 + monthly_return)
        real_value = capital / ((1 + monthly_inflation)**month)
        inflation_loss = invested / ((1 + monthly_inflation)**month)
        
        if month % 12 == 0:
            history.append({
                'Anno': month // 12,
                'Nominale': capital,
                'Reale': real_value,
                'Investito': invested,
                'Perdita Inflazione': inflation_loss,
                'Deprezzamento Inflazione': invested - inflation_loss,
                'Rendimento Nominale (%)': (capital / invested - 1) * 100,
                'Rendimento Reale (%)': ((real_value / invested)**(1/(month/12)) - 1) * 100
            })

    df = pd.DataFrame(history)
    
    # Risultati principali - Riquadro nero con testo bianco
    last = df.iloc[-1]
    st.markdown(f"""
    <div class='metric-box'>
        <div class='metric-title'>📌 Proiezione dopo {years} anni</div>
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px;">
            <div style="padding: 15px; border-radius: 10px;">
                <div class='metric-label'>Totale Investito</div>
                <div class='metric-value'>€{last['Investito']:,.0f}</div>
                <div class='metric-explanation'>Somma di tutti i versamenti effettuati</div>
            </div>
            <div style="padding: 15px; border-radius: 10px;">
                <div class='metric-label'>Valore Nominale</div>
                <div class='metric-value'>€{last['Nominale']:,.0f}</div>
                <div class='metric-explanation'>Cifra effettivamente accumulata</div>
            </div>
            <div style="padding: 15px; border-radius: 10px;">
                <div class='metric-label'>Valore Reale (oggi)</div>
                <div class='metric-value'>€{last['Reale']:,.0f}</div>
                <div class='metric-explanation'>Potere d'acquisto attuale</div>
            </div>
            <div style="padding: 15px; border-radius: 10px;">
                <div class='metric-label'>Perdita Inflazione</div>
                <div class='metric-value'>€{last['Deprezzamento Inflazione']:,.0f}</div>
                <div class='metric-explanation'>Valore eroso dall'inflazione</div>
            </div>
        </div>
    </div>
    """, unsafe_allow_html=True)
    
    # Grafico
    fig, ax = plt.subplots(figsize=(12, 6))
    
    # Curve principali
    ax.plot(df['Anno'], df['Investito'], label='Totale Investito', color='#FFA500', linewidth=2.5)
    ax.plot(df['Anno'], df['Nominale'], label='Valore Nominale', color='#4CAF50', linewidth=2.5)
    ax.plot(df['Anno'], df['Reale'], label='Valore Reale (netto inflazione)', color='#2196F3', linewidth=2.5)
    ax.plot(df['Anno'], df['Perdita Inflazione'], label='Deprezzamento per inflazione', color='#F44336', linewidth=2.5)
    
    # Punti ogni 10 anni
    decadal_years = [y for y in range(0, years+1, 10) if y <= years]
    if years not in decadal_years:
        decadal_years.append(years)
    
    decadal_data = df[df['Anno'].isin(decadal_years)]
    
    markers = ['o', 's', 'D', '^']  # Diversi marker per ogni linea
    colors = ['#FFA500', '#4CAF50', '#2196F3', '#F44336']
    
    for i, col in enumerate(['Investito', 'Nominale', 'Reale', 'Perdita Inflazione']):
        ax.scatter(decadal_data['Anno'], decadal_data[col], 
                  color=colors[i], marker=markers[i], s=100, 
                  label=f'{col} (punti decennali)')
    
    ax.set_title(f'Andamento investimento in {years} anni', pad=20, fontsize=16)
    ax.set_xlabel('Anni', labelpad=10)
    ax.set_ylabel('Valore (€)', labelpad=10)
    ax.grid(True, alpha=0.3)
    ax.legend(loc='upper left', framealpha=1)
    ax.set_facecolor('#f9f9f9')
    fig.patch.set_facecolor('#f9f9f9')
    
    st.pyplot(fig)
    
    # Tabella riepilogativa ogni 10 anni
    st.subheader("📊 Dettaglio decennale")
    
    # Anni da mostrare (ogni 10 + eventuale anno finale)
    table_years = [y for y in range(10, years+1, 10)]
    if years % 10 != 0 and years > 10:
        table_years.append(years)
    if years < 10:
        table_years = [years]
    
    summary = df[df['Anno'].isin(table_years)].copy()
    
    # Tabella:
    st.dataframe(
        summary[['Investito', 'Nominale', 'Reale', 'Deprezzamento Inflazione']]
        .rename(columns={
            'Investito': 'Totale Investito (€)',
            'Nominale': 'Valore Nominale (€)',
            'Reale': 'Valore Reale (€)',
            'Deprezzamento Inflazione': 'Perdita per Inflazione (€)'
        })
        .style.format({
            'Totale Investito (€)': '€{:,.0f}',
            'Valore Nominale (€)': '€{:,.0f}',
            'Valore Reale (€)': '€{:,.0f}',
            'Perdita per Inflazione (€)': '€{:,.0f}'
        })
        .set_properties(**{'color': 'black', 'background-color': '#f9f9f9'})
        .set_table_styles([{
            'selector': 'th',
            'props': [('background-color', '#f0f2f6'), ('color', 'black')]
        }]),
        height=(len(summary) * 35) + 38,
        use_container_width=True
    )
    
    # Conclusioni
    st.markdown("---")
    st.header("💡 Cosa ci insegna questo simulatore?")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown(f"""
        ### Potere degli investimenti a lungo termine
        - Con **€{monthly_investment}/mese** per {years} anni:
          - Hai investito **€{last['Investito']:,.0f}**
          - Potresti avere **€{last['Nominale']:,.0f}** (nominale)
          - Che equivalgono a **€{last['Reale']:,.0f}** di oggi
        - Senza investire, l'inflazione avrebbe ridotto il tuo potere d'acquisto a **€{last['Perdita Inflazione']:,.0f}**
        """)
        
        st.markdown("""
        ### Il tempo è fondamentale
        - I primi anni la crescita è lenta
        - Dopo 15-20 anni l'effetto diventa significativo
        - Dopo 30+ anni i risultati diventano impressionanti
        """)
    
    with col2:
        st.markdown(f"""
        ### Protezione dall'inflazione
        - Con inflazione al {inflation}% annuo:
          - €100 oggi varranno €{100/(1+inflation/100)**10:.1f} tra 10 anni
          - €100 oggi varranno €{100/(1+inflation/100)**30:.1f} tra 30 anni
        - Investendo, hai mantenuto (e aumentato) il tuo potere d'acquisto
        """)
        
        st.markdown("""
        ### Prova a modificare i parametri
        1. Aumenta l'investimento mensile (prova con €500 o €1000)
        2. Modifica il rendimento atteso (prova con 8-10%)
        3. Estendi l'orizzonte temporale
        4. Osserva come cambiano i risultati
        5. Non stupitevi, è matematica, interesse composto, che Einstein ha definito l'ottava meraviglia del mondo!
        """)
    
    st.markdown("""
    ---
    > **Nota**: Questo è un modello semplificato. I rendimenti passati non garantiscono quelli futuri. 
    Valuta sempre attentamente le tue scelte di investimento.
    """)

# ============================================
# SIDEBAR
# ============================================
if st.session_state.get("sidebar_state") == "expanded":
    with st.sidebar:
        st.markdown("""
        <div class="logo-container" style="text-align: center; margin-bottom: 2rem;">
            <h1 style="font-size: 2rem; margin-bottom: 0.5rem;">AP88</h1>
            <div style="color: var(--accent-light); font-size: 0.9rem; letter-spacing: 3px;">PRIVATE CLUB</div>
        </div>
        """, unsafe_allow_html=True)
        
        st.markdown("---")
        
        page = st.radio(
            "NAVIGAZIONE",
            ["🏠 Home", "🖼️ Album dei ricordi", "👑 Il re delle pagelle", "🎯 Jeopardy", "⚔️ Litighiamo", "📈 Pillole di Finanza"],
            label_visibility="collapsed"
        )
        
        st.markdown("---")
        
        st.markdown("""
        <div style="color: var(--text-secondary); font-size: 0.85rem; text-align: center; margin-top: 1rem;">
            Versione 1.0.0<br>
            Creata da Girla
        </div>
        """, unsafe_allow_html=True)
    

# ============================================
# ROUTER
# ============================================
if st.session_state.get("sidebar_state") == "expanded":
    if page == "🏠 Home": 
        home_page()
    elif page == "🖼️ Album dei ricordi":
        album_page()
    elif page == "👑 Il re delle pagelle":
        game_1()
    elif page == "🎯 Jeopardy":
        game_2()
    elif page == "⚔️ Litighiamo":
        game_3()
    elif page == "📈 Pillole di Finanza":
        finanza_page()
