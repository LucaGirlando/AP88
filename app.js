// ==========================================================================
// STATE MANAGEMENT & DATASETS
// ==========================================================================

const APP_STATE = {
    unlocked: false,
    profile: null, // "Guest" or "Paci", "Girla", etc.
    language: 'it', // 'it' or 'en'
    theme: 'dark', // 'dark' or 'light'
    activeView: 'home',
    activeTrip: 'sardegna2021',
    quiz: {
        gameStarted: false,
        gameOver: false,
        team1Name: 'Squadra 1',
        team2Name: 'Squadra 2',
        team1Score: 0,
        team2Score: 0,
        questionsUsed: new Set(),
        currentQuestion: null,
        questionCount: 0,
        currentTeam: 1, // 1 or 2
        selectedAnswer: null
    },
    jeopardy: {
        gameStarted: false,
        gameOver: false,
        selectedCharacter: 'Girla',
        players: [], // Array of names
        scores: {}, // name -> score
        answeredQuestions: new Set(), // Set of "categoryIndex_valueIndex"
        currentQuestion: null, // [categoryIndex, valueIndex]
        showAnswer: false,
        currentTurnPlayerIndex: 0
    },
    voting: {
        gameStarted: false,
        gameOver: false,
        participants: [], // Array of names
        votersVoted: 0, // Count of votes in current round
        currentVoterIndex: 0,
        currentQuestion: '',
        questionsUsed: new Set(),
        votes: {}, // voter -> voted
        roundResults: {} // participant -> votesCount
    }
};

// --- DICTIONARIES AND DATA ---
const MAIN_MEMBERS = ["Paci", "Girla", "Paga", "Bax", "Ari", "Chiara", "Ceci", "Gaia"];

const MEMBER_INFO = {
    Paci: {
        name: "Paci",
        image: "Paci.jpg",
        stats: { trips: 5, avg: 8.7, max: "9.5 (Barcellona)", best: "Barcellona 24/25" },
        nicknames: ["SARDO VERO", "IL PADRINO", "IL BENEFATTORE", "COLUI CHE LA SPIEGA", "LO STOMACO DEBOLE"],
        timeline: [
            { trip: "Sardegna 2021", grade: "8", nick: "SARDO VERO: EJA", desc: "Conclude il suo mese di permanenza raggiungendo quasi la cittadinanza onoraria, festeggia la settimana da fidanzato non nel migliore dei modi, ma a tutti gli effetti risultata il miglior cagatore e il mastro cannaiolo." },
            { trip: "Corfù 2022", grade: "9-", nick: "IL PADRINO", desc: "Pronto per l'ennesima estate da single, ma sta volta da solo. Fiero del suo status, ma con ancora qualche strascico. Gli manca sempre la prima marcia, ma non cade nella tentazione dei roiti nucleari. Ultima sera maledetto da un vodoo greco. Mette in stand by la compagnia per una sera, causa: possiamo dire che 'papà è tornato'." },
            { trip: "Puglia 2023", grade: "8", nick: "IL BENEFATTORE", desc: "Dopo il periodo di carcere (non per aver rubato le barrette) a Monopoli, torna insieme ai boys ad Alezio city. La sua specialità è palleggiare e giocare a calcio appena scesi dalla macchina, incurante del terreno di gioco perde qualche pallone di troppo. Dopo una sostanziosa donazione alla fondazione Panigalli, viene ricompensato con un goal al 95'. Mezzo voto in meno per lo stile talmente zanza che Cellery può accompagnare solo; menzione d'onore per gli occhiali di cui si voleva liberare 30 secondi dopo averli comprati." },
            { trip: "Croazia 2024", grade: "8.5", nick: "COLUI CHE LA SPIEGA", desc: "Partenza in salita per lui dopo il tentato omicidio da parte di Ari con l'aria condizionata [si si!] che gli ha causato un giorno di stop. In tutta la vacanza non tocca mai i fornelli e nemmeno il cazzo, per fortuna a Monza lo aspettano almeno quattro amiche 2010 della sorella. Durante tutta la vacanza si gasa per le storie di una tipa a Caso, peccato che l'ultimo giorno scoprirà essere la fidanzata di una famosa cantante Milanese (zona Duomo). Impossibile non fare acquisti scam ogni vacanza: 7€ di succo a bordo strada e 7€ di Puff in disco (girla non approva)." },
            { trip: "Barcellona 24/25", grade: "9.5", nick: "LO STOMACO DEBOLE", desc: "Dopo mesi di organizzazione, tra sistemazione dei letti e cenone di capodanno, il mister Paci affronta il match tra alti e bassi. Parte con un palo in faccia per il coffe chiuso. Si rialza con la serata al Negro potendo tirare un sospiro di sollievo per aver fatto spendere 120€ ai suoi amici. Per lui l'anno non comincia nel migliore dei modi, tra una quasi rissa col papi Bax e una giornata passata tra coperte e vomito, salvato solo dalla sua dottoressa personale. Si riprende con grande stile, carico per poter gestire da un lato le richieste di foto della sua nuova ragazza e dall'altro le cagate dei suoi amici (sia letterali che non). Nella serata degli hamburger assemblatore di panini e supervisore." }
        ]
    },
    Girla: {
        name: "Girla",
        image: "Girla.jpg",
        stats: { trips: 5, avg: 9.0, max: "9.5 (Barcellona)", best: "Barcellona 24/25" },
        nicknames: ["IL T-REX", "PITA ADVISOR", "ANTHONY MARTIAL", "EHI EWA", "CIPOLLE SUDARE"],
        timeline: [
            { trip: "Sardegna 2021", grade: "9", nick: "IL T-REX", desc: "Crea grossi meme per tutta la vacanza, si riscopre artista, ma resta umile rimanendo l'uomo del filtro, tranne la sera di san Lorenzo nella quale si improvvisa tiratore scelto. Batte miglio tornando in positivo di 26 centesimi." },
            { trip: "Corfù 2022", grade: "8.5", nick: "PITA ADVISOR", desc: "Gestisce l'economia della casa e della vacanza chiudendo come previsto con il bilancio migliore tra tutti. È MOLTO attento alla pulizia dopo le due settimane di convivenza con letizia ad eccezione del pigiama che lo usa ancora sporco. L'ultima sera regala spettacolo facendo capire ad ari che non è il suo tipo e rischia la rissa quando gli viene chiesto 1€ di mancia. Se volete mangiare una Pita sapete a chi chiedere." },
            { trip: "Puglia 2023", grade: "9", nick: "ANTHONY MARTIAL", desc: "Quest'anno viene contraddistinto dalla sua eleganza, dovuta all'utile generato in questo suo 2023, grazie al quale si imborghesisce e non indossa capi al di sotto del millino. Anche quest'anno non si smentisce nella creazione di meme (potrebbe tranquillamente essere l'admin di nonsonobellomaspaccio) però un problema fisico lo costringe ai box più di una volta. Nelle due serate fatte non si iscrive al tabellino dei marcatori per non ritrovarsi nella stessa situazione dell'Ucraina." },
            { trip: "Croazia 2024", grade: "9", nick: "EHI EWA, HAI PROGRAMMI STASERA?", desc: "Freschissimo di laurea ci sono grandi aspettative su di lui, dovute anche ad un aumento di budget dopo i recenti investimenti ben fatti. Illude tutti offrendo la cena a Spalato, ma in 0.0035 secondi finisce su Splitwise, facendo capire che la musica non è cambiata (come in macchina di Bax). In cucina però si esalta caramellando qualsiasi cosa assomigli ad una cipolla e in serata si cucina le 2005 finlandesi diffondendo il 'Lesgoski'. Il suo prime lo vive sicuramente in Bosnia dove grazie al cambio favorevole, vive due giorni in Black Friday che gli permettono di ordinare anche l'antipasto a cena. Verso fine vacanza si scopre che il suo grande miglioramento in inglese non è dovuto alle lezioni della Terzi ma a delle call con l'headquarter di Varsavia." },
            { trip: "Barcellona 24/25", grade: "9.5", nick: "CIPOLLE CARAMELLATE", desc: "Arriva con un zoo intero sulla spalla che però non riesce a soddisfare causa chiusura per feste sfondandosi però con due cope di nada al bar. Lui ha lo stomaco di ferro e il kebab non lo sente nemmeno, probabilmente aveva già preso farmaci per guarire l'inculata dei 120€. Nonostante questa cosa l'abbia destabilizzato un po' la sera di capodanno si diverte e si gode la serata, ma quando scoccano le 3 non c'è n'è per nessuno, si siede al tavolo entrando in mutismo selettivo. L'ultima sera si scontra con martina nella preparazione delle cipolle caramellate ma tutto è bene quel che finisce bene." }
        ]
    },
    Paga: {
        name: "Paga",
        image: "Paga.jpg",
        stats: { trips: 5, avg: 8.6, max: "9.5 (Corfù)", best: "Corfù 2022" },
        nicknames: ["ER FREGOLA", "IL BARISTA", "IL MEGAFONO", "RIGATONI, NO FUSILLI", "RISO SENZA LATTOSIO"],
        timeline: [
            { trip: "Sardegna 2021", grade: "8", nick: "ER FREGOLA", desc: "Mangia di notte carciofini e funghi a non finire. Il pagafigometro è alle stelle ma si esaurisce in una sola poppata con la marti. Sforna più nuggets del MC ma non viene assunto per mancanza di laurea." },
            { trip: "Corfù 2022", grade: "9.5", nick: "IL BARISTA", desc: "Paga di più i voli perché deve imbarcare il boa in stiva e le ragazze a cui ha preparato il caffè lo sanno bene. Passa ogni alba a cavalcioni sulla terrazza facendo catcalling e quando funziona gli tocca giocare coi tacchetti a 6 nel pantano (meglio non girare il materasso). Vive di rendita dalle pentole pulite il primo giorno. Ci ricorda che: Abbiamo casa a 3 minuti a piedi dal Montecristo." },
            { trip: "Puglia 2023", grade: "8", nick: "IL MEGAFONO", desc: "Un po' sottotono rispetto agli altri anni forse anche grazie al fatto che arriva a pancia piena con un goal poco prima della partenza. La sua giornata tipo è: mi sveglio, mangio, rutto, cago e bestemmio, per poi ripetere questa sequenza fino a cena. Non ha più il fisico di una volta, però si merita mezzo voto in più per l'insalata di riso che è bastata a sfamare tutti gli abitanti di Alezio city." },
            { trip: "Croazia 2024", grade: "9-", nick: "RIGATONI, NO FUSILLI", desc: "Il re di Brisbane ha sulle spalle la responsabilità di aver prenotato 10 case, ottima quella 'a 3 minuti da Dubrovnik' se non fosse che in mezzo c'è la dogana bosniaca con un'ora di coda ad ogni passaggio. Durante il viaggio itinerante ne organizza un altro per la settimana dopo, un po' per poppare in toscana e un po' per scroccare in Sarda e all'Elba. Prima che la Polo di Chiara partisse gli lascia un bel rigatone sopra, costringendo i boys a 5 giorni di stenti in attesa del preventivo per una portiera nuova, mentre lui muore le ultime due serate. -0,5 per i video home tour alla ciuccia toscana, ma +0,5 per gli shot offerti alle finlandesi per la squadra." },
            { trip: "Barcellona 24/25", grade: "9-", nick: "SI CON RISO SENZA LATTOSIO", desc: "Inizia la vacanza in maniera tranquilla lasciandosi trascinare da girla verso il lato oscuro del risparmio ed ecco qui il primo errore, un kebab dalla qualità discutibile mangiato il 30 dicembre alle ore 13.24 lo rende il più grande incubo di ferdi, il quale non riesce più ad usare il bagno nei 3 giorni successivi. A capodanno fa la sua figura, si iscrive al tabellino ma per problemi di organizzazione non riesce a siglare la doppietta. L'ultima sera si improvvisa capo cuoco a casa martina supervisionando la creazione degli hamburger." }
        ]
    },
    Bax: {
        name: "Bax",
        image: "Bax.jpg",
        stats: { trips: 5, avg: 8.8, max: "9+ (Croazia)", best: "Croazia 2024" },
        nicknames: ["NICKI LAUDA", "IL PENGWIN", "LA ZECCA DI STATO", "DELUX", "PAPÀ V"],
        timeline: [
            { trip: "Sardegna 2021", grade: "8.5", nick: "NICKI LAUDA", desc: "Recupera in fretta dall'infortunio per esserci e guidare la squadra con la sua puma infuocata. Non vuole i soldi della cauzione perché non è un poveraccio. Mezzo punto in meno per il gommone rotto." },
            { trip: "Corfù 2022", grade: "9-", nick: "IL PENGWIN", desc: "Dopo la buona prestazione dell'anno scorso si riconferma pilota, prova a scaldare le gomme dietro la safety car innescando le ire dei maranza greci. Scommette il patrimonio familiare con girla puntando su Paci. Se non ti sveglia con la musica techno la mattina sicuro chiederà 'chi ha bevuto l'acqua stanotte?'" },
            { trip: "Puglia 2023", grade: "8.5", nick: "LA ZECCA DI STATO", desc: "Rinnova per il terzo anno con la scuderia per la felicità dei tifosi. Rimane fregato essendo l’unico ad avere soldi in contanti, sperando che tornino prima della benza di Corfù 2022. I genitori di tutti sono tranquilli perché conoscono ogni nostro spostamento grazie a lui che fa le veci di Pierluigi Pardo con Marta e la Carla. Ogni giorno al Mare porta un ombrellone solo per se stesso causa allergia al sole. Se non giochi al 'grande gioco dei nomi' ti sgozza, stacce." },
            { trip: "Croazia 2024", grade: "9+", nick: "DELUX", desc: "Per il quarto anno di fila si riconferma pilota, consuma un po' troppa benzina guidando come un pazzo e una volta, ascoltando Milano Testarossa, tenta la quadkill sui boys andando dritto ad una curva. Le sua giornata tipo è caratterizzata da: 3 ore di macchina con max 5 canzoni diverse, minimo una tappa alla Lidl/Plodine/Mumbaza, max 2 ore in spiaggia, guardare la stellata ogni sera (senza mai trovare Giove e Saturno). Il tutto viene sempre riportato a fine giornata a Maria che ormai è più informata di paga sulla croazia. Fa un po' da papà agli altri tre boys, inoltre quest'anno sostituisce il gioco dei nomi con qualsiasi gioco di carte possibile. -0.5 per il doppio passo del drink 'offerto' a paga in disco." },
            { trip: "Barcellona 24/25", grade: "9", nick: "PAPÀ V", desc: "Il papà del gruppo non si smentisce e arriva il 30 sera con tutti i bambini in gita. Gestisce alla perfezione spese e pasti e il 31 sera non si sbottona godendosi la serata davvero signore senza alzare troppo l'omero, ma rischia l'espulsione nel faccia a faccia con Paci, il tutto fortunatamente si risolve con una stretta di mano (e un abbraccio). Dopo che tutto l'1 prova ad utilizzare uno dei due bagni che erano occupati contemporaneamente da paga, decide di arrendersi e tornare in italia con cecilia per poter finalmente cagare." }
        ]
    },
    Ari: {
        name: "Ari",
        image: "Ari.jpg",
        stats: { trips: 5, avg: 8.5, max: "10 (Barcellona)", best: "Barcellona 24/25" },
        nicknames: ["BULBASAUR", "LA CAMIONISTA", "LA BENZINAIA", "STANGA?MAGARI", "IN SMARTWORKING"],
        timeline: [
            { trip: "Sardegna 2021", grade: "7.5", nick: "BULBASAUR", desc: "Qualche snitchata di troppo le fa crescere le treccine colorate alla 69. Quando non dorme è simpatica come quelli delle prevendite in spiaggia." },
            { trip: "Corfù 2022", grade: "8", nick: "LA CAMIONISTA", desc: "Situazione sentimentale inizialmente in dubbio ma chiarita appena in tempo e questo fa sì che passi una settimana mediamente tranquilla, esibendosi in uscite come vaffanculo, cazzo e porca troia a greci che però l'italiano lo capiscono. Non resiste più di due minuti senza parlare di sesso e in quei due minuti parla di Giulio. Nonostante l'infortunio nel finale non rinuncia al suo pacchetto di heets giornaliero a 4€." },
            { trip: "Puglia 2023", grade: "9-", nick: "LA BENZINAIA", desc: "Arriva con il collo marchiato dal Conte Mattia e uccide subito il mood della vacanza utilizzando un terzo del budget della spesa per comprare gli assorbenti; e mentre a lei non è mai arrivato il ciclo i boys si sono visti costretti ad alternare giorni senza dentifricio a giorni senza sapone per le mani. Si sta ancora chiedendo perché il pieno di benzina iniziale non sia stato messo su Splitwise, abbassando ad ogni richiesta il QI medio italiano, ma anche strappando ogni volta una risata a tutto il gruppo e facendo alzare continuamente il suo voto." },
            { trip: "Croazia 2024", grade: "8-", nick: "STANGA?MAGARI", desc: "C'è un po' di Ari in questo Mattia. Per vendicarsi dei boys che hanno ordinato 10kg di carne in Bosnia gli attacca un bel virus prima di andarsene. Post laghi di Plitvice ha dei polpacci che manco @nicolòcereda01. Le partenze in salita non sono il suo forte ma non ha colpe sui danni causati alla Verpelli's Polo. Tenta l'omicidio su Paci alzando l'aria condizionata, ma purtroppo lo lascia solo oneshot. Nonostante il poco tempo passato al sole è riuscita ad abbronzarsi come Carlo Conti." },
            { trip: "Barcellona 24/25", grade: "10", nick: "IN SMARTWORKING", desc: "Pagella d'onore nonostante la sua assenza, che però le ha fatto guadagnare punti infiniti come figlia. Fortunatamente per lei si trattava del primo capodanno low-cost non causando rimorsi dal punto di vista economico. Viene comunque aggiornata tramite videochiamata anche se averla dal vivo sarebbe stata tutt'altra cosa ❤." }
        ]
    },
    Chiara: {
        name: "Chiara",
        image: "Chiara.jpg",
        stats: { trips: 4, avg: 8.0, max: "8+ (Corfù, Sardegna)", best: "Corfù 2022" },
        nicknames: ["LO GNOCCO", "BIG ROM", "LA PART-TIME", "AMMAN"],
        timeline: [
            { trip: "Sardegna 2021", grade: "8+", nick: "LO GNOCCO", desc: "Sta ancora cercando il computer per vedere le olimpiadi. Alterna lamentele ad ordini con picchi di altruismo saltuari. È ancora a porto rotondo ad aspettare gli spaghetti alle vongole." },
            { trip: "Corfù 2022", grade: "8+", nick: "BIG ROM", desc: "Parte con la squadra nonostante un po' di influenza per il precampionato alzando un po' troppo il gomito la sera, dando spettacolo pisciando in mare come mamma l'ha fatta. L'acqua sicuramente non regge il confronto con Milano Marittima però una o due spiagge si sono salvate. Negli ultimi giorni di mercato un trasferimento inaspettato la porta A LLORET DE MAR. Entro, infetto, esco, ciao." },
            { trip: "Puglia 2023", grade: "7.5", nick: "LA PART-TIME", desc: "Come l'anno scorso viene richiamata dal prestito a metà stagione. Solo una serata no per lei, causa risposta deludente da parte della relatrice della tesi, ma viene distratta dai numerosi rutti dei boys dopo l'ottima pasta al pesto Rana. Voto basso a causa della vittoria sia del premio come miglior outfit delle girls, con il vestito d’oro ad alberobello, sia quello della girl meno scassa cazzo." },
            { trip: "Croazia 2024", grade: "8", nick: "AMMAN", desc: "Se l'acqua di Corfù era come quella di Milano Marittima, i paesaggi croati invece assomigliano molto alla Giordania (ancora da capire se ci sia andata). Se sali sulla sua macchina sei certo di vedere tutti i patrimoni Unesco ad ogni viaggio. Le sue speranze sono riposte nella cena di pesce dell'ultima sera, dove rimane delusa da un risotto alla milanese. Per il terzo anno di fila viene richiamata dal prestito, ma sta volta si porta dietro anche Ari. -0.5 per il solito part time, + 0.5 per aver messo la macchina." }
        ]
    },
    Ceci: {
        name: "Ceci",
        image: "Ceci.jpg",
        stats: { trips: 4, avg: 8.4, max: "9+ (Barcellona)", best: "Barcellona 24/25" },
        nicknames: ["@JACOGILA", "THE WEEKEND", "LA CAFONA", "LA RADIOLINA"],
        timeline: [
            { trip: "Sardegna 2021", grade: "8", nick: "@JACOGILA", desc: "C'è un po' di ceci in questo jacopo; il suo apparecchio puzza come l'acqua di porto ottiolu, in casa è utile come l'ombrellone con 50 km/h di vento. Mezzo voto in più per la scopata sul letto di trave." },
            { trip: "Corfù 2022", grade: "8", nick: "THE WEEKEND", desc: "C'è un po' di ceci in questo... Di giorno pacata e amichevole e di notte a tratti difficile da controllare. Nelle due sere al Montecristo si sbronza pesantemente da un momento all'altro senza che nessuno capisca come e quando sia successo. Appena sente blinding lights diventa più piccante del spicy cheese avli sauce. Un ringraziamento a jaki per il passaggio (poverino) Ps non prestatele i calzini." },
            { trip: "Puglia 2023", grade: "8.5", nick: "LA CAFONA", desc: "Partendo dal presupposto che il duomo fa cagare perché ci sono i piccioni fuori, è importante evidenziare la tranquillità e i nervi saldi con cui gestisce la scelta della spiaggia la mattina dell’arrivo ad Alezio city, insistendo molto per andare in questo luogo sconosciuto detto Porto Cesareo. Purtroppo come navigatore non da il meglio di sè ma almeno permette alle girls di risparmiare una notte di affitto a Monopoli, facendole arrivare il giorno dopo con le sue indicazioni." },
            { trip: "Barcellona 24/25", grade: "9+", nick: "LA RADIOLINA", desc: "Si presenta in inferiorità numerica a dover fronteggiare un'armata di boys pronta a distruggerle l'umore. Dopo la maratona di BARCELLONA effettuata per prendere un caffè con eugi fa ininterrottamente due cose: chiederti di fare una foto foto e se sei contento che lei sia lì con te e prontamente ogni volta tocca rispondere si. Anche lei con il timore di diventare stitica decide di abbandonare la nave in anticipo e scappa con bax il 2 mattina." }
        ]
    },
    Gaia: {
        name: "Gaia",
        image: "Gaia.jpg",
        stats: { trips: 3, avg: 8.17, max: "9 (Corfù)", best: "Corfù 2022" },
        nicknames: ["LA LAVASTOVIGLIE", "LA POETESSA", "DORAEMON"],
        timeline: [
            { trip: "Sardegna 2021", grade: "7.5", nick: "LA LAVASTOVIGLIE", desc: "Cauzione a rischio per il bicchiere rotto; è un'amante delle spiagge sconosciute. Difficilmente ha gli occhi aperti dopo il tramonto ma recupera in cucina." },
            { trip: "Corfù 2022", grade: "9", nick: "LA POETESSA", desc: "Grazie a qualche sostanza resiste sorprendentemente fino all'ultima sera dopo il tramonto, visita più grotte di Rocco Siffredi e delizia tutti con una grande massima che tradurremo dal latino nel seguente modo: 'Sei mia e adesso ti infilo il pisello'. PS: No cazzi dopo i pasti." },
            { trip: "Puglia 2023", grade: "8", nick: "DORAEMON", desc: "A differenza delle altre ragazze porta tutto il necessario e si permette il lusso di portarsi la sua colazione personale che nasconde accuratamente dai predatori durante il corso di tutta la vacanza. Piccolo scivolone nel suo ambito, le lavastoviglie: far partire il programma ECO da 4 ore e poi togliere la chiave che tiene accesa la corrente non è stata un'ottima idea. Importante citare anche la sua crisi di mezza età alla Praja." }
        ]
    }
};

const TRIP_DATA = {
    sardegna2021: {
        title: "Sardegna 2021",
        stats: { avg: 8.3, top: "10 (Trave)", participants: 11, duration: "7 giorni", location: "San Teodoro" },
        reports: [
            { name: "Trave", nick: "DARIO LAMPA", grade: "10", desc: "Regala spettacolo ai tifosi ogni giorno, gioca con una tranquillità da vero campione; calmo come il mare in sardegna con il maestrale. Gli dedicano una via a san teodoro dopo il tentato omicidio di girla e le casse di birra facendo manovra." },
            { name: "Miglio", nick: "THE MASK", grade: "9", desc: "9 come i chili persi sboccando come un vulcano. Insieme a girla guida la wave del risparmio e torna a casa in positivo di 25 centesimi." },
            { name: "Ari", nick: "BULBASAUR", grade: "7.5", desc: "Qualche snitchata di troppo le fa crescere le treccine colorate alla 69. Quando non dorme è simpatica come quelli delle prevendite in spiaggia." },
            { name: "Ceci", nick: "@JACOGILA", grade: "8", desc: "C'è un po' di ceci in questo jacopo; il suo apparecchio puzza come l'acqua di porto ottiolu, in casa è utile come l'ombrellone con 50 km/h di vento. Mezzo voto in più per la scopata sul letto di trave." },
            { name: "Paga", nick: "ER FREGOLA", grade: "8", desc: "Mangia di notte carciofini e funghi a non finire. Il pagafigometro è alle stelle ma si esaurisce in una sola poppata con la marti. Sforna più nuggets del MC ma non viene assunto per mancanza di laurea." },
            { name: "Chiara", nick: "LO GNOCCO", grade: "8+", desc: "Sta ancora cercando il computer per vedere le olimpiadi. Alterna lamentele ad ordini con picchi di altruismo saltuari. È ancora a porto rotondo ad aspettare gli spaghetti alle vongole." },
            { name: "Bax", nick: "NICKI LAUDA", grade: "8.5", desc: "Recupera in fretta dall'infortunio per esserci e guidare la squadra con la sua puma infuocata. Non vuole i soldi della cauzione perché non è un poveraccio. Mezzo punto in meno per il gommone rotto." },
            { name: "Gaia", nick: "LA LAVASTOVIGLIE", grade: "7.5", desc: "Cauzione a rischio per il bicchiere rotto; è un'amante delle spiagge sconosciute. Difficilmente ha gli occhi aperti dopo il tramonto ma recupera in cucina." },
            { name: "Auro & Gio", nick: "LUNATICHE", grade: "7.5", desc: "Incollate come gemelli siamesi, si completano a vicenda una aumentando il numero di canne giornaliere e l'altra iniziando a tatuarsi." },
            { name: "Paci", nick: "SARDO VERO: EJA", grade: "8", desc: "Conclude il suo mese di permanenza raggiungendo quasi la cittadinanza onoraria, festeggia la settimana da fidanzato non nel migliore dei modi, ma a tutti gli effetti risultata il miglior cagatore e il mastro cannaiolo." },
            { name: "Girla", nick: "IL T-REX", grade: "9", desc: "Crea grossi meme per tutta la vacanza, si riscopre artista, ma resta umile rimanendo l'uomo del filtro, tranne la sera di san Lorenzo nella quale si improvvisa tiratore scelto. Batte miglio tornando in positivo di 26 centesimi." }
        ]
    },
    corfu2022: {
        title: "Corfù 2022",
        stats: { avg: 8.7, top: "9.5 (Paga)", participants: 9, duration: "8 giorni", location: "Corfù, Grecia" },
        reports: [
            { name: "Trave", nick: "IL TIKTOKER", grade: "9", desc: "Entusiasmo alle stelle per lui, riesce a svincolarsi a parametro zero prima della partenza e parla con ogni essere vivente con i capelli mediamente lunghi improvvisandosi Nikola Greku. Dopo serate di riscaldamento l'ultima sera si presenta sul dischetto e non sbaglia. Un punto in più per aver rinunciato ad albume e minchiate proteiche." },
            { name: "Ari", nick: "LA CAMIONISTA", grade: "8", desc: "Situazione sentimentale inizialmente in dubbio ma chiarita appena in tempo e questo fa sì che passi una settimana mediamente tranquilla, esibendosi in uscite come vaffanculo, cazzo e porca troia a greci che però l'italiano lo capiscono. Non resiste più di due minuti senza parlare di sesso e in quei due minuti parla di Giulio. Nonostante l'infortunio nel finale non rinuncia al suo pacchetto di heets giornaliero a 4€." },
            { name: "Ceci", nick: "THE WEEKEND", grade: "8", desc: "C'è un po' di ceci in questo... Di giorno pacata e amichevole e di notte a tratti difficile da controllare. Nelle due sere al Montecristo si sbronza pesantemente da un momento all'altro senza che nessuno capisca come e quando sia successo. Appena sente blinding lights diventa più piccante del spicy cheese avli sauce. Un ringraziamento a jaki per il passaggio (poverino). Ps non prestatele i calzini." },
            { name: "Chiara", nick: "BIG ROM", grade: "8+", desc: "Parte con la squadra nonostante un po' di influenza per il precampionato alzando un po' troppo il gomito la sera, dando spettacolo pisciando in mare come mamma l'ha fatta. L'acqua sicuramente non regge il confronto con Milano Marittima però una o due spiagge si sono salvate. Negli ultimi giorni di mercato un trasferimento inaspettato la porta A LLORET DE MAR. Entro, infetto, esco, ciao." },
            { name: "Bax", nick: "IL PENGWIN", grade: "9-", desc: "Dopo la buona prestazione dell'anno scorso si riconferma pilota, prova a scaldare le gomme dietro la safety car innescando le ire dei maranza greci. Scommette il patrimonio familiare con girla puntando su Paci. Se non ti sveglia con la musica techno la mattina sicuro chiederà 'chi ha bevuto l'acqua stanotte?'" },
            { name: "Paga", nick: "IL BARISTA", grade: "9.5", desc: "Paga di più i voli perché deve imbarcare il boa in stiva e le ragazze a cui ha preparato il caffè lo sanno bene. Passa ogni alba a cavalcioni sulla terrazza facendo catcalling e quando funziona gli tocca giocare coi tacchetti a 6 nel pantano (meglio non girare il materasso). Vive di rendita dalle pentole pulite il primo giorno. Ci ricorda che: Abbiamo casa a 3 minuti a piedi dal Montecristo." },
            { name: "Girla", nick: "PITA ADVISOR", grade: "8.5", desc: "Gestisce l'economia della casa e della vacanza chiudendo come previsto con il bilancio migliore tra tutti. È MOLTO attento alla pulizia dopo le due settimane di convivenza con letizia ad eccezione del pigiama che lo usa ancora sporco. L'ultima sera regala spettacolo facendo capire ad ari che non è il suo tipo e rischia la rissa quando gli viene chiesto 1€ di mancia. Se volete mangiare una Pita sapete a chi chiedere." },
            { name: "Gaia", nick: "LA POETESSA", grade: "9", desc: "Grazie a qualche sostanza resiste sorprendentemente fino all'ultima sera dopo il tramonto, visita più grotte di Rocco Siffredi e delizia tutti con una grande massima che tradurremo dal latino nel seguente modo: 'Sei mia e adesso ti infilo il pisello'. PS: No cazzi dopo i pasti." },
            { name: "Paci", nick: "IL PADRINO", grade: "9-", desc: "Pronto per l'ennesima estate da single, ma sta volta da solo. Fiero del suo status, ma con ancora qualche strascico. Gli manca sempre la prima marcia, ma non cade nella tentazione dei roiti nucleari. Ultima sera maledetto da un vodoo greco. Mette in stand by la compagnia per una sera, causa: possiamo dire che 'papà è tornato'." }
        ]
    },
    puglia2023: {
        title: "Puglia 2023",
        stats: { avg: 8.25, top: "9 (Girla)", participants: 9, duration: "7 giorni", location: "Puglia (Alezio, Polignano)" },
        reports: [
            { name: "Girla", nick: "ANTHONY MARTIAL", grade: "9", desc: "Quest'anno viene contraddistinto dalla sua eleganza, dovuta all'utile generato in questo suo 2023, grazie al quale si imborghesisce e non indossa capi al di sotto del millino. Anche quest'anno non si smentisce nella creazione di meme (potrebbe tranquillamente essere l'admin di nonsonobellomaspaccio) però un problema fisico lo costringe ai box più di una volta. Nelle due serate fatte non si iscrive al tabellino dei marcatori per non ritrovarsi nella stessa situazione dell'Ucraina." },
            { name: "Ceci", nick: "LA CAFONA", grade: "8.5", desc: "Partendo dal presupposto che il duomo fa cagare perché ci sono i piccioni fuori, è importante evidenziare la tranquillità e i nervi saldi con cui gestisce la scelta della spiaggia la mattina dell’arrivo ad Alezio city, insistendo molto per andare in questo luogo sconosciuto detto Porto Cesareo. Purtroppo come navigatore non da il meglio di sè ma almeno permette alle girls di risparmiare una notte di affitto a Monopoli, facendole arrivare il giorno dopo con le sue indicazioni." },
            { name: "Ari", nick: "LA BENZINAIA", grade: "9-", desc: "Arriva con il collo marchiato dal Conte Mattia e uccide subito il mood della vacanza utilizzando un terzo del budget della spesa per comprare gli assorbenti; e mentre a lei non è mai arrivato il ciclo i boys si sono visti costretti ad alternare giorni senza dentifricio a giorni senza sapone per le mani. Si sta ancora chiedendo perché il pieno di benzina iniziale non sia stato messo su Splitwise, abbassando ad ogni richiesta il QI medio italiano, ma anche strappando ogni volta una risata a tutto il gruppo e facendo alzare continuamente il suo voto." },
            { name: "Bax", nick: "LA ZECCA DI STATO", grade: "8.5", desc: "Rinnova per il terzo anno con la scuderia per la felicità dei tifosi. Rimane fregato essendo l’unico ad avere soldi in contanti, sperando che tornino prima della benza di Corfù 2022. I genitori di tutti sono tranquilli perché conoscono ogni nostro spostamento grazie a lui che fa le veci di Pierluigi Pardo con Marta e la Carla. Ogni giorno al Mare porta un ombrellone solo per se stesso causa allergia al sole. Se non giochi al 'grande gioco dei nomi' ti sgozza, stacce." },
            { name: "Gaia", nick: "DORAEMON", grade: "8", desc: "A differenza delle altre ragazze porta tutto il necessario e si permette il lusso di portarsi la sua colazione personale che nasconde accuratamente dai predatori durante il corso di tutta la vacanza. Piccolo scivolone nel suo ambito, le lavastoviglie: far partire il programma ECO da 4 ore e poi togliere la chiave che tiene accesa la corrente non è stata un’ottima idea. Importante citare anche la sua crisi di mezza età alla Praja." },
            { name: "Chiara", nick: "LA PART-TIME", grade: "7.5", desc: "Come l’anno scorso viene richiamata dal prestito a metà stagione. Solo una serata no per lei, causa risposta deludente da parte della relatrice della tesi, ma viene distratta dai numerosi rutti dei boys dopo l’ottima pasta al pesto Rana. Voto basso a causa della vittoria sia del premio come miglior outfit delle girls, con il vestito d’oro ad alberobello, sia quello della girl meno scassa cazzo." },
            { name: "Paga", nick: "IL MEGAFONO", grade: "8", desc: "Un po’ sottotono rispetto agli altri anni forse anche grazie al fatto che arriva a pancia piena con un goal poco prima della partenza. La sua giornata tipo è: mi sveglio, mangio, rutto, cago e bestemmio, per poi ripetere questa sequenza fino a cena. Non ha più il fisico di una volta, però si merita mezzo voto in più per l’insalata di riso che è bastata a sfamare tutti gli abitanti di Alezio city." },
            { name: "Paci", nick: "IL BENEFATTORE", grade: "8", desc: "Dopo il periodo di carcere (non per aver rubato le barrette) a Monopoli, torna insieme ai boys ad Alezio city. La sua specialità è palleggiare e giocare a calcio appena scesi dalla macchina, incurante del terreno di gioco perde qualche pallone di troppo. Dopo una sostanziosa donazione alla fondazione Panigalli, viene ricompensato con un goal al 95'. Mezzo voto in meno per lo stile talmente zanza che Cellery può accompagnare solo; menzione d’onore per gli occhiali di cui si voleva liberare 30 secondi dopo averli comprati." },
            { name: "Gio", nick: "MIKE TYSON", grade: "8", desc: "Abbastanza boy da stare nella macchina dei boys, ma non abbastanza da dormire nella dependance dei boys. Durante la serata alla Praja tenta il KO su un maranza che la stava palpando, ma purtroppo va a vuoto. Quando ne ha più bisogno e non ci sperava più, ecco pronto un contratto multimilionario dall’Al Nassr per duettare in attacco con Cristiano Ronaldo." }
        ]
    },
    croazia2024: {
        title: "Croazia 2024",
        stats: { avg: 8.6, top: "9+ (Bax)", participants: 7, duration: "9 giorni", location: "Dubrovnik, Split, Bosnia" },
        reports: [
            { name: "Il bimbo", nick: "MR DICK", grade: "10-", desc: "1,8km (0,9€) di pura follia, all'inizio viene preso con tante speranze, ma poi sostituito subito dai panardi della Lidl, finendo per diventare una mascotte. Inizia a macinare terreno venendo utilizzato come scarpetta per il sugo durante una cena circondati da gatti. Poi ci aiuta con un paio di panini alla nutella marcia durante le colazioni. E quando il suo compito sembrava finito, tanto da venir lanciato e preso a calci, stupisce tutti ed entra a gamba tesa nella penultima cena dei boys, carriandola totalmente dopo essersi fatto 20 minuti nel forno." },
            { name: "Bax", nick: "DELUX", grade: "9+", desc: "Per il quarto anno di fila si riconferma pilota, consuma un po' troppa benzina guidando come un pazzo e una volta, ascoltando Milano Testarossa, tenta la quadkill sui boys andando dritto ad una curva. Le sua giornata tipo è caratterizzata da: 3 ore di macchina con max 5 canzoni diverse, minimo una tappa alla Lidl/Plodine/Mumbaza, max 2 ore in spiaggia, guardare la stellata ogni sera. Il tutto viene sempre riportato a fine giornata a Maria. Fa un po' da papà agli altri tre boys. -0.5 per il doppio passo del drink 'offerto' a paga in disco." },
            { name: "Girla", nick: "EHI EWA, HAI PROGRAMMI?", grade: "9", desc: "Freschissimo di laurea ci sono grandi aspettative su di lui, dovute anche ad un aumento di budget dopo i recenti investimenti ben fatti. Illude tutti offrendo la cena a Spalato, ma in 0.0035 secondi finisce su Splitwise, facendo capire che la musica non è cambiata (come in macchina di Bax). In cucina però si esalta caramellando qualsiasi cosa assomigli ad una cipolla e in serata si cucina le 2005 finlandesi diffondendo il 'Lesgoski'. Il suo prime lo vive sicuramente in Bosnia dove grazie al cambio favorevole, vive due giorni in Black Friday. Verso fine vacanza si scopre che il suo grande miglioramento in inglese non è dovuto alle lezioni della Terzi ma a delle call con l'headquarter di Varsavia." },
            { name: "Paga", nick: "RIGATONI, NO FUSILLI", grade: "9-", desc: "Il re di Brisbane ha sulle spalle la responsabilità di aver prenotato 10 case, ottima quella 'a 3 minuti da Dubrovnik' se non fosse che in mezzo c'è la dogana bosniaca con un'ora di coda ad ogni passaggio. Durante il viaggio itinerante ne organizza un altro per la settimana dopo, un po' per poppare in toscana e un po' per scroccare in Sarda e all'Elba. Prima che la Polo di Chiara partisse gli lascia un bel rigatone sopra, costringendo i boys a 5 giorni di stenti in attesa del preventivo per una portiera nuova. -0,5 per i video home tour alla ciuccia toscana, ma +0,5 per gli shot offerti alle finlandesi per la squadra." },
            { name: "Paci", nick: "COLUI CHE LA SPIEGA", grade: "8.5", desc: "Partenza in salita per lui dopo il tentato omicidio da parte di Ari con l'aria condizionata [si si!] che gli ha causato un giorno di stop. In tutta la vacanza non tocca mai i fornelli e nemmeno il cazzo, per fortuna a Monza lo aspettano almeno quattro amiche 2010 della sorella. Durante tutta la vacanza si gasa per le storie di una tipa a Caso, peccato che l'ultimo giorno scoprirà essere la fidanzata di una famosa cantante Milanese. Impossibile non fare acquisti scam ogni vacanza: 7€ di succo a bordo strada e 7€ di Puff in disco." },
            { name: "Ari", nick: "STANGA?MAGARI", grade: "8-", desc: "C'è un po' di Ari in questo Mattia. Per vendicarsi dei boys che hanno ordinato 10kg di carne in Bosnia gli attacca un bel virus prima di andarsene. Post laghi di Plitvice ha dei polpacci che manco @nicolòcereda01. Le partenze in salita non sono il suo forte ma non ha colpe sui danni causati alla Verpelli's Polo. Tenta l'omicidio su Paci alzando l'aria condizionata, ma purtroppo lo lascia solo oneshot. Nonostante il poco tempo passato al sole è riuscita ad abbronzarsi come Carlo Conti." },
            { name: "Chiara", nick: "AMMAN", grade: "8", desc: "Se l'acqua di Corfù era come quella di Milano Marittima, i paesaggi croati invece assomigliano molto alla Giordania (ancora da capire se ci sia andata). Se sali sulla sua macchina sei certo di vedere tutti i patrimoni Unesco ad ogni viaggio. Le sue speranze sono riposte nella cena di pesce dell'ultima sera, dove rimane delusa da un risotto alla milanese. Per il terzo anno di fila viene richiamata dal prestito, ma sta volta si porta dietro anche Ari. -0.5 per il solito part time, + 0.5 per aver messo la macchina." }
        ]
    },
    barcellona2024: {
        title: "Barcellona 24/25",
        stats: { avg: 9.2, top: "10 (Marti/Ari)", participants: 8, duration: "5 giorni", location: "Barcellona, Spagna" },
        reports: [
            { name: "Marti", nick: "L'INFLUENCER", grade: "10", desc: "Fresca di firma sul contratto è costretta a stamparsi un sorriso in faccia per non fare brutta figura con gli amici del fidanzato. Un po' provata ancora dal recente cambio di telefono che l'ha costretta a ritrovarsi con l'iphone 16, non nasconde comunque la sue doti da boomer ben visibili ai suoi follower. Prepara la squadra alla serata principale infilando scorte di alcol in tutti gli orifizi dei compagni. L'ultima sera ospita un hamburgerata importante mantendendo la calma sotto la pressione degli chef paga e girla." },
            { name: "Paci", nick: "LO STOMACO DEBOLE", grade: "9.5", desc: "Dopo mesi di organizzazione, tra sistemazione dei letti e cenone di capodanno, il mister Paci affronta il match tra alti e bassi. Parte con un palo in faccia per il coffe chiuso. Si rialza con la serata al Negro potendo tirare un sospiro di sollievo per aver fatto spendere 120€ ai suoi amici. Per lui l'anno non comincia nel migliore dei modi, tra una quasi rissa col papi Bax e una giornata passata tra coperte e vomito, salvato solo dalla sua dottoressa personale. Si riprende con grande stile, carico per poter gestire da un lato le richieste di foto della sua nuova ragazza e dall'altro le cagate dei suoi amici. Nella serata degli hamburger assemblatore di panini e supervisore." },
            { name: "Girla", nick: "CIPOLLE SUDARE", grade: "9.5", desc: "Arriva con un zoo intero sulla spalla che però non riesce a soddisfare causa chiusura per feste sfondandosi però con due cope di nada al bar. Lui ha lo stomaco di ferro e il kebab non lo sente nemmeno, probabilmente aveva già preso farmaci per guarire l'inculata dei 120€. Nonostante questa cosa l'abbia destabilizzato un po' la sera di capodanno si diverte e si gode la serata, ma quando scoccano le 3 non c'è n'è per nessuno, si siede al tavolo entrando in mutismo selettivo. L'ultima sera si scontra con martina nella preparazione delle cipolle caramellate ma tutto è bene quel che finisce bene." },
            { name: "Bax", nick: "PAPÀ V", grade: "9", desc: "Il papà del gruppo non si smentisce e arriva il 30 sera con tutti i bambini in gita. Gestisce alla perfezione spese e pasti e il 31 sera non si sbottona godendosi la serata davvero signore senza alzare troppo l'omero, ma rischia l'espulsione nel faccia a faccia con Paci, il tutto fortunatamente si risolve con una stretta di mano (e un abbraccio). Dopo che tutto l'1 prova ad utilizzare uno dei due bagni che erano occupati contemporaneamente da paga, decide di arrendersi e tornare in italia con cecilia per poter finalmente cagare." },
            { name: "Ceci", nick: "LA RADIOLINA", grade: "9+", desc: "Si presenta in inferiorità numerica a dover fronteggiare un'armata di boys pronta a distruggerle l'umore. Dopo la maratona di BARCELLONA effettuata per prendere un caffè con eugi fa ininterrottamente due cose: chiederti di fare una foto foto e se sei contento che lei sia lì con te e prontamente ogni volta tocca rispondere si. Anche lei con il timore di diventare stitica decide di abbandonare la nave in anticipo e scappa con bax il 2 mattina." },
            { name: "Paga", nick: "RISO SENZA LATTOSIO", grade: "9-", desc: "Inizia la vacanza in maniera tranquilla lasciandosi trascinare da girla verso il lato oscuro del risparmio ed ecco qui il primo errore, un kebab dalla qualità discutibile mangiato il 30 dicembre alle ore 13.24 lo rende il più grande incubo di ferdi, il quale non riesce più ad usare il bagno nei 3 giorni successivi. A capodanno fa la sua figura, si iscrive al tabellino ma per problemi di organizzazione non riesce a siglare la doppietta. L'ultima sera si improvvisa capo cuoco a casa martina supervisionando la creazione degli hamburger." },
            { name: "Ferdi", nick: "CAZZO DICI", grade: "9", desc: "Dopo aver passato il natale in solitaria viene invaso dall'uragano italiano, ma non si scompone e sembra apprezzare l'arrivo dei monzesi grazie anche al supporto prontamente arrivato dalla bolivia. In casa fa finta di fare qualcosa per nn fare brutta figura con gli ospiti mostrando subito l'italiano imparato in questi mesi: 'Mi mangio la mela mentecatto succhiami il cazzo'. Al Negro rojo non incide, dimenticandosi le chiavi della discordia rischiando di causare una rissa tra coinquilini. L'ultima sera sente la pressione di girla perdendo la lucidità davanti ad un bicchiere per la felicità della proprietaria di casa." },
            { name: "Ari", nick: "IN SMARTWORKING", grade: "10", desc: "Pagella d'onore nonostante la sua assenza, che però le ha fatto guadagnare punti infiniti come figlia. Fortunatamente per lei si trattava del primo capodanno low-cost non causando rimorsi dal punto di vista economico. Viene comunque aggiornata tramite videochiamata anche se averla dal vivo sarebbe stata tutt'altra cosa ❤." }
        ]
    }
};

const TRANSLATIONS = {
    it: {
        pass_title: "🔒 Accesso Riservato AP88",
        pass_subtitle: "Inserisci la password generale per sbloccare l'archivio.",
        pass_error: "Password errata. Riprova.",
        pass_hint_title: "Suggerimento:",
        pass_hint_desc: "Soprannome di chi ha preso il voto più alto nella pagella della Sardegna (Nome e Cognome).",
        profile_select_title: "Chi sei?",
        profile_select_subtitle: "Seleziona il tuo profilo ufficiale per accedere alle tue schede personali.",
        profile_select_guest: "Entra come Ospite",
        nav_home: "Home Pagelle",
        nav_gallery: "Membri AP88",
        nav_quiz: "Re delle Pagelle",
        nav_jeopardy: "Jeopardy Board",
        nav_voting: "Litighiamo! (18+)",
        nav_finance: "Pillole di Finanza",
        nav_profile: "Profilo Personale",
        version: "Versione 2.0.0 (Vite modern)",
        created_by: "Sviluppato con ❤️ da Girla",
        logout_profile: "Esci / Cambia Profilo",
        home_intro: "Benvenuti nell'archivio ufficiale del gruppo AP88. Qui troverete tutte le pagelle delle nostre vacanze e le statistiche storiche dei membri del gruppo.",
        stats_historical_title: "📈 STATISTICHE STORICHE",
        stats_top_voti: "🏆 TOP 10 VOTI",
        stats_presenze: "👥 PRESENZE TOTALI",
        stats_medie: "📊 CLASSIFICA MEDIE",
        gallery_intro: "I volti storici del club privato AP88. Clicca su una scheda per aprire i dettagli del profilo e lo storico pagelle.",
        quiz_intro: "Sfida a quiz tra due squadre sulle pagelle dei viaggi! Rispondi a 20 domande e scopri chi conosce meglio il gruppo.",
        quiz_setup_header: "Inserisci i nomi delle squadre",
        quiz_team1_label: "Squadra 1",
        quiz_team2_label: "Squadra 2",
        quiz_start_btn: "Inizia la Sfida",
        next_question: "Prossima Domanda",
        game_over: "Fine Partita",
        replay: "Rigioca",
        jeopardy_intro: "Gioco a griglia in stile Jeopardy. Scegliete a turno una cella della griglia di Girla e rispondete per accumulare o perdere punti.",
        jeopardy_setup_header: "Configurazione Jeopardy",
        jeopardy_char_label: "Gioca sulle domande di:",
        jeopardy_players_count: "Numero di giocatori (1-8)",
        jeopardy_start_btn: "Inizia Partita",
        jeopardy_over: "Jeopardy Completato!",
        jeopardy_final_scores: "Punteggi Finali:",
        jeopardy_new_char: "Nuova Partita",
        jeopardy_correct_answer: "Risposta corretta:",
        jeopardy_did_you_guess: "Hai indovinato la risposta?",
        yes: "Sì",
        no: "No",
        reveal_answer: "Rivela Risposta",
        voting_intro: "Gioco di votazioni segrete e spietate. Perfetto per rovinare amicizie e litigare!",
        voting_rules_title: "⚠️ REGOLE DEL GIOCO (18+)",
        voting_rule_1: "Inserite i nomi di tutti i partecipanti presenti (2-10).",
        voting_rule_2: "A schermo apparirà una frase del tipo 'Chi è il più predisposto a...'.",
        voting_rule_3: "A turno, ciascuno vota in SEGRETO sul dispositivo per un altro partecipante.",
        voting_rule_4: "NON rivelate il vostro voto durante la votazione!",
        voting_rule_5: "Alla fine della tornata, verranno mostrati i grafici e la tabella dei voti totali.",
        voting_start_btn: "INIZIA IL GIOCO ☠️",
        voting_turn_for: "VOTA IN SEGRETO:",
        voting_select_victim: "Seleziona la tua vittima:",
        voting_chart_title: "Chi finisce nel tritacarne?",
        voting_detail_title: "Tabella dei Voti Esposti",
        voting_table_voter: "Votante",
        voting_table_voted: "Ha votato",
        voting_next_question: "Prossima Domanda 💥",
        voting_new_party: "Resetta / Nuova Partita 🔄",
        finance_intro: "Una sezione per non farsi mangiare i risparmi dall'inflazione, dalle banche e dai promotori finanziari.",
        finance_lecture_title: "Lezioni di Finanza Bicocca",
        finance_lecture_desc: "Slide e videolezione di un seminario di educazione finanziaria tenuto in Bicocca in collaborazione con Starting Finance.",
        finance_lecture_alert: "Scopri perché ha senso investire, come battere l'inflazione, come valutare gli strumenti e cosa evitare assolutamente.",
        finance_watch_video: "Guarda la Videolezione (Google Drive)",
        finance_download_slides: "Scarica Slides PDF (Investire senza trappole)",
        finance_simulator_title: "Simulatore di Interesse Composto",
        finance_simulator_desc: "Simula la crescita dei risparmi impostando capitale iniziale, piano di accumulo mensile e tassi di rendimento attesi.",
        sim_initial_capital: "Capitale Iniziale (€)",
        sim_monthly_investment: "Investimento Mensile (€)",
        sim_years: "Orizzonte Temporale (Anni)",
        sim_return: "Rendimento Annuo Atteso (%)",
        sim_return_note: "Nota: L'indice S&P 500 rende storicamente oltre il 10% annuo.",
        sim_inflation: "Inflazione Media Attesa (%)",
        sim_projections_header: "Riepilogo Proiezioni",
        sim_total_invested: "Totale Investito",
        sim_total_invested_note: "Somma netta dei tuoi risparmi versati",
        sim_nominal_value: "Valore Nominale",
        sim_nominal_value_note: "Valore nominale finale lordo accumulato",
        sim_real_value: "Valore Reale",
        sim_real_value_note: "Potere d'acquisto effettivo attualizzato",
        sim_inflation_loss: "Erosione Inflazione",
        sim_inflation_loss_note: "Capitale eroso dall'inflazione se tenuto liquido",
        sim_chart_title: "Grafico di Crescita del Capitale (Nominale vs Reale)",
        sim_table_title: "Tabella di Riepilogo Decennale",
        sim_table_year: "Anno",
        sim_table_invested: "Totale Investito",
        sim_table_nominal: "Valore Nominale",
        sim_table_real: "Valore Reale (netto inflazione)",
        sim_table_loss: "Erosione da Inflazione",
        guest_profile_title: "Sei entrato come Ospite",
        guest_profile_desc: "Accedi selezionando uno dei profili ufficiali AP88 per visualizzare le tue pagelle e le tue statistiche storiche.",
        guest_profile_btn: "Seleziona Profilo",
        prof_trips: "Vacanze con il gruppo",
        prof_avg: "Media Voti Storica",
        prof_max: "Voto Massimo Ricevuto",
        prof_perf: "Migliore Performance",
        prof_history_title: "Storico Personale delle Pagelle"
    },
    en: {
        pass_title: "🔒 AP88 Restricted Access",
        pass_subtitle: "Enter the general password to unlock the private archive.",
        pass_error: "Wrong password. Try again.",
        pass_hint_title: "Hint:",
        pass_hint_desc: "Nickname of whoever got the highest grade in the Sardinia trip reports (First & Last Name).",
        profile_select_title: "Who are you?",
        profile_select_subtitle: "Select your official profile to access your personal stats.",
        profile_select_guest: "Enter as Guest",
        nav_home: "Trip Grades",
        nav_gallery: "AP88 Members",
        nav_quiz: "Grades Quiz",
        nav_jeopardy: "Jeopardy Board",
        nav_voting: "Litighiamo! (18+)",
        nav_finance: "Financial Pills",
        nav_profile: "Personal Profile",
        version: "Version 2.0.0 (Vite modern)",
        created_by: "Developed with ❤️ by Girla",
        logout_profile: "Logout / Change Profile",
        home_intro: "Welcome to the official archive of the AP88 group. Here you will find all the trip reports and historical statistics of the members.",
        stats_historical_title: "📈 HISTORICAL STATISTICS",
        stats_top_voti: "🏆 TOP 10 GRADES",
        stats_presenze: "👥 TOTAL PARTICIPATION",
        stats_medie: "📊 AVERAGE GRADES",
        gallery_intro: "The historical faces of the AP88 private club. Click a card to view profile details and reports history.",
        quiz_intro: "A quiz battle between two teams based on the trip reports! Answer 20 questions and see who knows the group best.",
        quiz_setup_header: "Enter team names",
        quiz_team1_label: "Team 1",
        quiz_team2_label: "Team 2",
        quiz_start_btn: "Start the Challenge",
        next_question: "Next Question",
        game_over: "Game Over",
        replay: "Play Again",
        jeopardy_intro: "Jeopardy grid game. Take turns choosing cells on Girla's grid and answer to gain or lose points.",
        jeopardy_setup_header: "Jeopardy Configuration",
        jeopardy_char_label: "Play on questions of:",
        jeopardy_players_count: "Number of players (1-8)",
        jeopardy_start_btn: "Start Jeopardy",
        jeopardy_over: "Jeopardy Completed!",
        jeopardy_final_scores: "Final Scores:",
        jeopardy_new_char: "New Game",
        jeopardy_correct_answer: "Correct answer:",
        jeopardy_did_you_guess: "Did you guess the answer?",
        yes: "Yes",
        no: "No",
        reveal_answer: "Reveal Answer",
        voting_intro: "Secret, savage voting game. Perfect for ruining friendships and starting arguments!",
        voting_rules_title: "⚠️ GAME RULES (18+)",
        voting_rule_1: "Enter the names of all participants present (2-10).",
        voting_rule_2: "A savage question will appear like 'Who is most likely to...'.",
        voting_rule_3: "One by one, vote in SECRET for another participant on the device.",
        voting_rule_4: "DO NOT reveal your vote during the voting process!",
        voting_rule_5: "At the end of the round, voting charts and detail logs will be revealed.",
        voting_start_btn: "START THE GAME ☠️",
        voting_turn_for: "VOTE IN SECRET:",
        voting_select_victim: "Select your victim:",
        voting_chart_title: "Who ends up in the meat grinder?",
        voting_detail_title: "Detailed Vote Table",
        voting_table_voter: "Voter",
        voting_table_voted: "Voted for",
        voting_next_question: "Next Question 💥",
        voting_new_party: "Reset / New Game 🔄",
        finance_intro: "A section dedicated to keeping your savings safe from inflation, banks, and financial advisors.",
        finance_lecture_title: "Bicocca Finance Lectures",
        finance_lecture_desc: "Slides and video lecture of a financial education seminar held at Bicocca in collaboration with Starting Finance.",
        finance_lecture_alert: "Learn why it makes sense to invest, how to beat inflation, how to evaluate assets, and what traps to avoid.",
        finance_watch_video: "Watch Video Lecture (Google Drive)",
        finance_download_slides: "Download PDF Slides (Investing without traps)",
        finance_simulator_title: "Compound Interest Simulator",
        finance_simulator_desc: "Simulate savings growth by setting initial capital, monthly savings plans, and expected returns.",
        sim_initial_capital: "Initial Capital (€)",
        sim_monthly_investment: "Monthly Savings (€)",
        sim_years: "Time Horizon (Years)",
        sim_return: "Expected Annual Return (%)",
        sim_return_note: "Note: The S&P 500 index historically returns over 10% annually.",
        sim_inflation: "Expected Inflation (%)",
        sim_projections_header: "Projections Summary",
        sim_total_invested: "Total Invested",
        sim_total_invested_note: "Net sum of your deposited savings",
        sim_nominal_value: "Nominal Value",
        sim_nominal_value_note: "Final nominal cash accumulated",
        sim_real_value: "Real Value",
        sim_real_value_note: "Actual purchasing power today",
        sim_inflation_loss: "Inflation Loss",
        sim_inflation_loss_note: "Capital eroded by inflation if kept in cash",
        sim_chart_title: "Capital Growth Chart (Nominal vs Real)",
        sim_table_title: "Decadal Summary Table",
        sim_table_year: "Year",
        sim_table_invested: "Total Invested",
        sim_table_nominal: "Nominal Value",
        sim_table_real: "Real Value (net of inflation)",
        sim_table_loss: "Erosion from Inflation",
        guest_profile_title: "Logged in as Guest",
        guest_profile_desc: "Log in by choosing one of the official AP88 profiles to view your report card summaries and historical statistics.",
        guest_profile_btn: "Select Profile",
        prof_trips: "Trips with the group",
        prof_avg: "Historical Average",
        prof_max: "Highest Grade Received",
        prof_perf: "Best Performance",
        prof_history_title: "Personal Report Cards History"
    }
};

const STATS_TOP_VOTI = [
    { name: "Trave", trip: "Sardegna", grade: "10" },
    { name: "Marti", trip: "Barcellona", grade: "10" },
    { name: "Il bimbo", trip: "Croazia", grade: "10-" },
    { name: "Girla", trip: "Barcellona", grade: "9.5" },
    { name: "Paci", trip: "Barcellona", grade: "9.5" },
    { name: "Paga", trip: "Corfù", grade: "9.5" },
    { name: "Ceci", trip: "Barcellona", grade: "9+" },
    { name: "Bax", trip: "Croazia", grade: "9+" },
    { name: "Girla", trip: "Sardegna", grade: "9" },
    { name: "Gaia", trip: "Corfù", grade: "9" }
];

const STATS_PRESENZE = [
    { name: "Girla", count: 5 },
    { name: "Paga", count: 5 },
    { name: "Bax", count: 5 },
    { name: "Paci", count: 5 },
    { name: "Ari", count: 4 },
    { name: "Ceci", count: 4 },
    { name: "Chiara", count: 4 },
    { name: "Gaia", count: 3 },
    { name: "Gio", count: 2 },
    { name: "Trave", count: 2 }
];

const STATS_MEDIE = [
    { name: "Girla", avg: "9.0", trips: 5 },
    { name: "Bax", avg: "8.8", trips: 5 },
    { name: "Paga", avg: "8.6", trips: 5 },
    { name: "Paci", avg: "8.7", trips: 5 }, // updated to match timeline average
    { name: "Ceci", avg: "8.4", trips: 4 },
    { name: "Gaia", avg: "8.17", trips: 3 },
    { name: "Ari", avg: "8.5", trips: 5 }, // updated to match timeline average
    { name: "Chiara", avg: "8.0", trips: 4 }
];

// --- QUIZ QUESTIONS ---
const QUIZ_QUESTIONS = [
    { question: "Famosa via a San Teodoro", options: ["Traverso", "Traversa", "Il Traverso", "La Traversa"], correct: "La Traversa", source: "Sardegna 2021" },
    { question: "Quanti chili perse Miglio in Sardegna 2021?", options: ["5kg", "7kg", "9kg", "12kg"], correct: "9kg", source: "Sardegna 2021" },
    { question: "Come veniva chiamata Ari nelle pagelle Sardegna 2021?", options: ["Bulbasaur", "La Camionista", "Stanga?Magari", "La Benzinaia"], correct: "Bulbasaur", source: "Sardegna 2021" },
    { question: "Perché Ceci ha preso mezzo voto in più in Sardegna 2021?", options: ["Per la scopata sul letto di Trave", "Per l'apparecchio", "Per Porto Ottiolu", "Per l'ombrellone con 50 km/h di vento"], correct: "Per la scopata sul letto di Trave", source: "Sardegna 2021" },
    { question: "Cosa mangiava Paga di notte in Sardegna 2021?", options: ["Nuggets", "Carciofini e funghi", "Carciofini", "Funghi"], correct: "Carciofini e funghi", source: "Sardegna 2021" },
    { question: "Perché Chiara usava il computer in Sardegna 2021?", options: ["Per ordinare gli spaghetti", "Per vedere le Olimpiadi", "Per prenotare voli", "Per giocare a Snake"], correct: "Per vedere le Olimpiadi", source: "Sardegna 2021" },
    { question: "Perché Bax ha perso mezzo punto in Sardegna 2021?", options: ["Per il gommone rotto", "Per la Puma infuocata", "Per aver litigato con Ceci", "Per non aver pagato la cauzione"], correct: "Per il gommone rotto", source: "Sardegna 2021" },
    { question: "Perché la cauzione di Gaia era a rischio in Sardegna 2021?", options: ["Per il tavolo rotto", "Per il letto sporco", "Per il bicchiere rotto", "Per la lavastoviglie rotta"], correct: "Per il bicchiere rotto", source: "Sardegna 2021" },
    { question: "Come venivano chiamate Auro e Gio nelle pagelle Sardegna 2021?", options: ["Le Gemelle", "Lunatiche", "Le Siamesi", "Le tossiche"], correct: "Lunatiche", source: "Sardegna 2021" },
    { question: "Quale titolo ha ottenuto Paci in Sardegna 2021?", options: ["Miglior tiratore", "Miglior cagatore", "Miglior sboccatore", "Miglior bevitore"], correct: "Miglior cagatore", source: "Sardegna 2021" },
    { question: "Di quanti centesimi Girla ha battuto Miglio in Sardegna 2021?", options: ["25 centesimi", "26 centesimi", "35 centesimi", "36 centesimi"], correct: "26 centesimi", source: "Sardegna 2021" },
    { question: "Come veniva chiamato Trave nelle pagelle Corfù 2022?", options: ["Il Tiktoker", "Il Barista", "Il Pengwin", "Pita Advisor"], correct: "Il Tiktoker", source: "Corfù 2022" },
    { question: "Cosa ha rinunciato a mangiare Trave a Corfù 2022?", options: ["Anguria", "Tiramisù", "Conchiglie", "Albume"], correct: "Albume", source: "Corfù 2022" },
    { question: "Quanto costava il pacchetto giornaliero di heets di Ari a Corfù 2022?", options: ["2€", "3€", "4€", "5€"], correct: "4€", source: "Corfù 2022" },
    { question: "Con quale canzone di The Weekend Ceci diventava piccante a Corfù 2022?", options: ["After Hours", "Save Your Tears", "Hardest to Love", "Blinding Lights"], correct: "Blinding Lights", source: "Corfù 2022" },
    { question: "Dove è stata trasferita Chiara a Corfù 2022?", options: ["Lloret de Mar", "Milano Marittima", "Gallipoli", "Giordania"], correct: "Lloret de Mar", source: "Corfù 2022" },
    { question: "Cosa soffriva di più Bax a Corfù 2022?", options: ["Maranzate", "Mancanza d'acqua", "Aria condizionata", "Il sole"], correct: "Mancanza d'acqua", source: "Corfù 2022" },
    { question: "Chi ha pagato di più i voli a Corfù 2022?", options: ["Chiara", "Ceci", "Paci", "Paga"], correct: "Paga", source: "Corfù 2022" },
    { question: "Di che marca aveva la camicia Girla quando gli veniva chiesto 1€ di mancia a Corfù 2022?", options: ["Zara", "Polo", "Primark", "Alcott"], correct: "Primark", source: "Corfù 2022" },
    { question: "Quanto distava casa boys dal Montecristo a Corfù 2022?", options: ["1 min", "2 min", "3 min", "4 min"], correct: "3 min", source: "Corfù 2022" },
    { question: "Era single Paci a Corfù 2022?", options: ["Si, ma non da solo", "Si, da solo", "No, ma non da solo", "No, da solo"], correct: "Si, da solo", source: "Corfù 2022" },
    { question: "Come veniva chiamato Girla nelle pagelle Puglia 2023?", options: ["Anthony Martial", "Ehi Ewa", "Il T-Rex", "Pita Advisor"], correct: "Anthony Martial", source: "Puglia 2023" },
    { question: "Cosa fa cagare per Ceci?", options: ["Porto Cesareo", "Alezio City", "Monopoli", "Il Duomo"], correct: "Il Duomo", source: "Puglia 2023" },
    { question: "Cosa ha comprato Ari che ha ucciso il mood della spesa in Puglia 2023?", options: ["Heets", "Struccanti", "Assorbenti", "Melanzane"], correct: "Assorbenti", source: "Puglia 2023" },
    { question: "Cosa nascondeva Gaia durante la vacanza in Puglia 2023?", options: ["Soldi", "Colazione", "Ragazzo", "Le chiavi"], correct: "Colazione", source: "Puglia 2023" },
    { question: "Con chi avrebbe duettato Gio secondo le pagelle Puglia 2023?", options: ["Cristiano Ronaldo", "Lionel Messi", "Zlatan", "Maradona"], correct: "Cristiano Ronaldo", source: "Puglia 2023" },
    { question: "Cosa ha donato Paci in Puglia 2023?", options: ["Occhiali da sole", "Barrette", "Cappellino", "Soldi alla fondazione Panigalli"], correct: "Soldi alla fondazione Panigalli", source: "Puglia 2023" },
    { question: "Che colore era il vestito di Chiara ad Alberobello in Puglia 2023?", options: ["Rosso", "Argento", "Oro", "Turchese"], correct: "Oro", source: "Puglia 2023" },
    { question: "Che anno consecutivo era con la scuderia per Bax in Puglia 2023?", options: ["Primo", "Secondo", "Terzo", "Quarto"], correct: "Terzo", source: "Puglia 2023" },
    { question: "Qual era la sequenza giornaliera di Paga in Puglia 2023?", options: ["Sveglio, mangio, cago", "Sveglio, mangio, rutto, cago, bestemmio", "Dormo, rutto, cago, bestemmio", "Dormo, cago, bestemmio"], correct: "Sveglio, mangio, rutto, cago, bestemmio", source: "Puglia 2023" },
    { question: "Come veniva chiamato Ari nelle pagelle Croazia 2024?", options: ["Stanga?Magari", "La Camionista", "La Benzinaia", "In Smartworking"], correct: "Stanga?Magari", source: "Croazia 2024" },
    { question: "Quando ha attaccato Ari il virus ai boys prima di andarsene?", options: ["Sardegna 2021", "Corfù 2022", "Puglia 2023", "Croazia 2024"], correct: "Croazia 2024", source: "Croazia 2024" },
    { question: "A cosa assomigliavano i paesaggi croati per Chiara?", options: ["Giordania", "Egitto", "Milano Marittima", "Libano"], correct: "Giordania", source: "Croazia 2024" },
    { question: "Quante case ha prenotato Paga in Croazia 2024?", options: ["8", "9", "10", "11"], correct: "10", source: "Croazia 2024" },
    { question: "Cosa ha lasciato Paga sopra la Polo di Chiara in Croazia 2024?", options: ["Un adesivo", "Della pasta", "Una rigata", "Un rigatone"], correct: "Un rigatone", source: "Croazia 2024" },
    { question: "Cosa ha causato un giorno di stop a Paci in Croazia 2024?", options: ["Aria condizionata", "Troppo alcol", "Colpo alla testa", "Cibo avariato"], correct: "Aria condizionata", source: "Croazia 2024" },
    { question: "Quante canzoni ascoltava Bax durante le 3 ore di macchina in Croazia 2024?", options: ["3", "5", "7", "10"], correct: "5", source: "Croazia 2024" },
    { question: "Quanto costava Mr Dick in Croazia 2024?", options: ["0.7€", "0.9€", "1.7€", "1.9€"], correct: "0.9€", source: "Croazia 2024" },
    { question: "Cosa ha mangiato Paga che ha creato problemi a Capodanno Barcellona?", options: ["Kebab", "Pizza", "Hamburger", "Pasta al pesto Rana"], correct: "Kebab", source: "Barcellona 24/25" },
    { question: "Cosa sudava Girla a Barcellona 24/25?", options: ["Ascelle", "Cipolle", "Culo", "Fronte"], correct: "Cipolle", source: "Barcellona 24/25" },
    { question: "Perché Bax è tornato prima in Italia da Capodanno Barcellona?", options: ["Per poter cagare", "Per lavorare", "Per la famiglia", "Per non spendere"], correct: "Per poter cagare", source: "Barcellona 24/25" },
    { question: "Cosa faceva continuamente Ceci (La Radiolina) a Capodanno Barcellona?", options: ["Parlava/Chiedeva foto", "Dormiva", "Litigava", "Cantava"], correct: "Parlava/Chiedeva foto", source: "Barcellona 24/25" },
    { question: "Soprannome di Ferdi a Capodanno Barcellona?", options: ["Succhiami il cazzo", "Cazzo dici", "Mi mangio la mela", "Mentecatto"], correct: "Cazzo dici", source: "Barcellona 24/25" }
];

// --- JEOPARDY DATA (GIRLA) ---
const JEOPARDY_CATEGORIES = ["Generale", "Amore", "Scuola", "Viaggi", "Cibo"];
const JEOPARDY_QUESTIONS = {
    "0_0": { category: "Generale", value: 100, question: "Quando è nato Girla?", answer: "23 Marzo 2001" },
    "0_1": { category: "Generale", value: 200, question: "Come si chiamava il suo coniglio?", answer: "Willy" },
    "0_2": { category: "Generale", value: 300, question: "In che squadra giocava il bisnonno materno di Girla?", answer: "Milan (+ Cagliari, GC Vigevanesi, Sempre Avanti)" },
    "0_3": { category: "Generale", value: 400, question: "Quando (mese e anno) Girla si è fatto la pelata (margine di errore 3 mesi)?", answer: "Maggio 2022" },
    "0_4": { category: "Generale", value: 500, question: "Chi, quando e perché ha iniziato a chiamarlo 'Girla'?", answer: "Allenatore di calcio, elementari, per non confonderlo con Luca Cesari" },
    
    "1_0": { category: "Amore", value: 100, question: "Girla preferisce more o bionde? Occhi chiari o occhi scuri?", answer: "More - occhi chiari (anche prima di incontrare Ewa!)" },
    "1_1": { category: "Amore", value: 200, question: "Quante tipe si è fatto Girla in discoteca?", answer: "0" },
    "1_2": { category: "Amore", value: 300, question: "Quante relazioni ufficiali (no elementari) ha avuto e come si chiamavano le ragazze?", answer: "3: Chiara (non Verpelli), Letizia ed Ewa" },
    "1_3": { category: "Amore", value: 400, question: "Dimmi il nome/soprannome delle TRE 'situationship' (no relazioni) avute da Girla", answer: "Maria Luisa Montale (Lully), Alessia (la russa) e Lucia" },
    "1_4": { category: "Amore", value: 500, question: "Dopo varie relazioni/situationship, quale caratteristica sembra presentarsi maggiormente nelle ragazze trovate?", answer: "Daddy Issues (problemi con il padre) :)" },
    
    "2_0": { category: "Scuola", value: 100, question: "Cosa è andato a studiare Girla a Londra?", answer: "Quantitative Finance (with Data Science)" },
    "2_1": { category: "Scuola", value: 200, question: "Voto di laurea triennale di Girla (margine di errore: 2 punti)?", answer: "96" },
    "2_2": { category: "Scuola", value: 300, question: "Quanti debiti scolastici ha preso al liceo Girla?", answer: "8 debiti" },
    "2_3": { category: "Scuola", value: 400, question: "Voto di maturità di Girla (margine di errore: 1 punto)?", answer: "64" },
    "2_4": { category: "Scuola", value: 500, question: "Quante internship ha fatto in triennale e in quante associazioni universitarie è stato in magistrale?", answer: "2 internship (Fineco, Invesco) e 2 associazioni (Starting Finance, Miura)" },
    
    "3_0": { category: "Viaggi", value: 100, question: "Qual è il viaggio dei sogni di Girla?", answer: "Giappone" },
    "3_1": { category: "Viaggi", value: 200, question: "In quali due località di mare italiane Girla è sempre andato in vacanza fin da piccolo?", answer: "Alassio e Grottammare/San Benedetto del Tronto" },
    "3_2": { category: "Viaggi", value: 300, question: "Prima vacanza di Girla con il gruppo AP88 (luogo, anno, occasione)?", answer: "Capodanno Roma 2019" },
    "3_3": { category: "Viaggi", value: 400, question: "Quali di queste città Girla NON ha mai visitato: Madrid, Parigi, Monaco, Vienna, Varsavia?", answer: "Madrid e Parigi" },
    "3_4": { category: "Viaggi", value: 500, question: "Da quale regione italiana ha origine il cognome Girlando?", answer: "Sicilia" },
    
    "4_0": { category: "Cibo", value: 100, question: "Qual è la pizza preferita di Girla?", answer: "Diavola" },
    "4_1": { category: "Cibo", value: 200, question: "Qual è il drink preferito di Girla? Preferisce vino rosso o vino bianco?", answer: "Moscow Mule - Vino Rosso" },
    "4_2": { category: "Cibo", value: 300, question: "Cioccolato: bianco, al latte o fondente? Formaggio sulla pasta al sugo di pesce: sì o no?", answer: "Fondente - Assolutamente no formaggio sul pesce!" },
    "4_3": { category: "Cibo", value: 400, question: "Gin o Vodka? Lemon o Tonic? Tè alla Pesca o al Limone? Gorgonzola o Pecorino?", answer: "Gin, Tonic, Tè alla Pesca, Gorgonzola" },
    "4_4": { category: "Cibo", value: 500, question: "Carne o pesce? Dolce o salato? Carbonara o cacio e pepe? Tette o culo? Prima il latte o prima i cereali?", answer: "Pesce, salato, cacio e pepe, culo, prima i cereali" }
};

// --- VOTING QUESTIONS ("LITIGHIAMO") ---
const VOTING_QUESTIONS = [
    "Chi è il più predisposto a tradire il partner durante un viaggio?",
    "Chi è il più predisposto a fare sesso in un luogo pubblico?",
    "Chi è il più predisposto a provare un ménage à trois?",
    "Chi è il più predisposto a farsi trovare nudo in una situazione imbarazzante?",
    "Chi è il più predisposto a fare Onlyfans?",
    "Chi è il più predisposto a mandare un nudo per sbaglio nel gruppo?",
    "Chi è il più predisposto a farsi arrestare all'estero per qualcosa di stupido?",
    "Chi è il più predisposto a fare una figura di merda epica al primo appuntamento?",
    "Chi è il più predisposto a vomitare dopo appena due drink?",
    "Chi è il più predisposto a farsi scoprire con una sbronza molesta dai genitori?",
    "Chi è il più predisposto a finire in prigione per evasione fiscale?",
    "Chi è il più predisposto a rubare asciugamani e accappatoi dagli hotel?",
    "Chi è il più predisposto a corrompere un poliziotto locale?",
    "Chi è il più predisposto a tornare con un ex tossico rovinando tutto?",
    "Chi è il più predisposto a scrivere un papiro imbarazzante all'ex alle 4 del mattino da ubriaco?",
    "Chi è il più predisposto a farsi truffare da un finto profilo online (catfishing)?",
    "Chi è il più predisposto a ghostare una persona fidanzata senza motivo?",
    "Chi è il più predisposto a investire tutti i risparmi in criptovalute scam e perdere tutto?",
    "Chi è il più predisposto a credere ciecamente alla Terra Piatta o agli UFO?",
    "Chi è il più predisposto a entrare a far parte di una setta esoterica?",
    "Chi è il più predisposto a presentarsi già visibilmente ubriaco a un matrimonio formale?",
    "Chi è il più predisposto a rovinare un gioco di società litigando selvaggiamente?",
    "Chi è il più predisposto a farsi licenziare per un post cringe su Instagram?",
    "Chi è il più predisposto a fare sesso con il capo per fare carriera?",
    "Chi è il più predisposto a non farsi la doccia per un'intera vacanza estiva?",
    "Chi è il più predisposto a fare la pipì nella piscina dell'hotel?",
    "Chi è il più predisposto a scoreggiare sotto le lenzuola e chiudere dentro il partner?",
    "Chi è il più predisposto a diventare un influencer cringe su TikTok a 40 anni?",
    "Chi è il più predisposto a sposarsi a Las Vegas dopo mezza serata di alcol?",
    "Chi è il più predisposto a dimenticare il passaporto a casa prima di un volo transatlantico?"
];


// ==========================================================================
// CORE APP ROUTER & VIEWS CONTROLLER
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
    // Initialize CDNs
    lucide.createIcons();
    initThemeAndLanguage();
    initAuthFlows();
    initRouting();
    initTripTabs();
    initHistoricalStats();
    initGallery();
    initGames();
    initFinanceSimulator();
});

// Theme and Language initialization
function initThemeAndLanguage() {
    // Theme
    const savedTheme = localStorage.getItem("ap88_theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);
    APP_STATE.theme = savedTheme;
    updateThemeToggleIcons();

    const themeToggle = document.getElementById("theme-toggle-btn");
    themeToggle.addEventListener("click", () => {
        const currentTheme = document.documentElement.getAttribute("data-theme");
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", newTheme);
        APP_STATE.theme = newTheme;
        localStorage.setItem("ap88_theme", newTheme);
        updateThemeToggleIcons();
        
        // Re-render charts to adapt colors
        renderFinanceChart();
        if (APP_STATE.activeView === 'voting' && APP_STATE.voting.gameOver) {
            renderVotingChart();
        }
    });

    // Language
    const savedLang = localStorage.getItem("ap88_lang") || "it";
    APP_STATE.language = savedLang;
    document.getElementById("language-label").innerText = savedLang.toUpperCase();
    applyLanguageTranslations();

    const langToggle = document.getElementById("language-toggle-btn");
    langToggle.addEventListener("click", () => {
        const nextLang = APP_STATE.language === "it" ? "en" : "it";
        APP_STATE.language = nextLang;
        localStorage.setItem("ap88_lang", nextLang);
        document.getElementById("language-label").innerText = nextLang.toUpperCase();
        applyLanguageTranslations();
        
        // Refresh currently active views that are language-sensitive
        renderActiveView();
    });
}

function updateThemeToggleIcons() {
    const lightIcon = document.getElementById("theme-icon-light");
    const darkIcon = document.getElementById("theme-icon-dark");
    if (APP_STATE.theme === "dark") {
        lightIcon.classList.add("hidden");
        darkIcon.classList.remove("hidden");
    } else {
        lightIcon.classList.remove("hidden");
        darkIcon.classList.add("hidden");
    }
}

function applyLanguageTranslations() {
    const dict = TRANSLATIONS[APP_STATE.language];
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (dict[key]) {
            if (el.tagName === "INPUT" && el.hasAttribute("placeholder")) {
                el.setAttribute("placeholder", dict[key]);
            } else {
                el.innerText = dict[key];
            }
        }
    });
    lucide.createIcons();
}

// Authentication Flows (Unlocking app & Profile selection)
function initAuthFlows() {
    const passwordOverlay = document.getElementById("password-overlay");
    const profileOverlay = document.getElementById("profile-overlay");
    const appContainer = document.getElementById("app-container");
    
    // Check if previously unlocked
    const isUnlocked = localStorage.getItem("ap88_unlocked") === "true";
    const selectedProfile = localStorage.getItem("ap88_profile");
    
    if (isUnlocked) {
        APP_STATE.unlocked = true;
        passwordOverlay.classList.remove("active");
        
        if (selectedProfile) {
            APP_STATE.profile = selectedProfile;
            profileOverlay.classList.remove("active");
            appContainer.classList.remove("hidden");
            updateUIForCurrentUser();
        } else {
            // Unlocked but no profile selected
            showProfileSelection();
        }
    }

    // Password verification logic
    const pwInput = document.getElementById("password-input");
    const pwSubmit = document.getElementById("password-submit-btn");
    const pwError = document.getElementById("password-error");

    const attemptUnlock = () => {
        const val = pwInput.value.trim();
        if (val === "Dario Lampa") {
            APP_STATE.unlocked = true;
            localStorage.setItem("ap88_unlocked", "true");
            passwordOverlay.classList.remove("active");
            pwError.classList.add("hidden");
            showProfileSelection();
        } else {
            pwError.classList.remove("hidden");
            pwInput.classList.add("shake");
            setTimeout(() => pwInput.classList.remove("shake"), 500);
        }
    };

    pwSubmit.addEventListener("click", attemptUnlock);
    pwInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") attemptUnlock();
    });

    // Profile selection injection
    const gridContainer = document.getElementById("profile-selection-grid");
    gridContainer.innerHTML = "";
    
    MAIN_MEMBERS.forEach(member => {
        const card = document.createElement("div");
        card.className = "profile-card-option";
        card.innerHTML = `
            <img src="${member}.jpg" alt="${member}" onerror="this.src='https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80'">
            <span>${member}</span>
        `;
        card.addEventListener("click", () => selectProfile(member));
        gridContainer.appendChild(card);
    });

    // Enter as Guest
    const guestBtn = document.getElementById("guest-enter-btn");
    guestBtn.addEventListener("click", () => selectProfile("Guest"));

    // Sidebar change profile button
    document.getElementById("change-profile-btn").addEventListener("click", () => {
        localStorage.removeItem("ap88_profile");
        APP_STATE.profile = null;
        appContainer.classList.add("hidden");
        showProfileSelection();
    });

    // Guest card profiles selection button
    document.getElementById("guest-profile-select-btn").addEventListener("click", () => {
        localStorage.removeItem("ap88_profile");
        APP_STATE.profile = null;
        appContainer.classList.add("hidden");
        showProfileSelection();
    });
}

function showProfileSelection() {
    const profileOverlay = document.getElementById("profile-overlay");
    profileOverlay.classList.add("active");
    lucide.createIcons();
}

function selectProfile(profileName) {
    APP_STATE.profile = profileName;
    localStorage.setItem("ap88_profile", profileName);
    
    document.getElementById("profile-overlay").classList.remove("active");
    document.getElementById("app-container").classList.remove("hidden");
    
    updateUIForCurrentUser();
    renderActiveView();
}

function updateUIForCurrentUser() {
    const pill = document.getElementById("current-user-pill");
    const badge = document.getElementById("user-status-badge");
    const isGuest = APP_STATE.profile === "Guest";
    
    badge.innerText = isGuest ? "Guest" : APP_STATE.profile;
    badge.className = isGuest ? "badge" : "badge badge-accent";

    const imgSrc = isGuest ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&h=80&q=80' : `${APP_STATE.profile}.jpg`;

    pill.innerHTML = `
        <img src="${imgSrc}" alt="${APP_STATE.profile}" onerror="this.src='https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&h=80&q=80'">
        <div class="user-pill-info">
            <span class="user-pill-name">${APP_STATE.profile}</span>
            <span class="user-pill-role">${isGuest ? 'Ospite' : 'Main Profile'}</span>
        </div>
    `;
    lucide.createIcons();
}

// Router & navigation links
function initRouting() {
    const menuToggle = document.getElementById("sidebar-toggle-mobile-btn");
    const menuClose = document.getElementById("sidebar-close-mobile-btn");
    const sidebar = document.getElementById("app-sidebar");

    menuToggle.addEventListener("click", () => sidebar.classList.add("active"));
    menuClose.addEventListener("click", () => sidebar.classList.remove("active"));

    const navItems = document.querySelectorAll(".nav-item");
    navItems.forEach(item => {
        item.addEventListener("click", (e) => {
            e.preventDefault();
            const view = item.getAttribute("data-view");
            navigateTo(view);
            sidebar.classList.remove("active");
        });
    });

    // Check hash on load
    const hash = window.location.hash.replace("#", "");
    if (hash && ["home", "gallery", "quiz", "jeopardy", "voting", "finance", "profile"].includes(hash)) {
        navigateTo(hash);
    } else {
        navigateTo("home");
    }
}

function navigateTo(viewName) {
    APP_STATE.activeView = viewName;
    window.location.hash = viewName;

    // Toggle active classes in nav list
    document.querySelectorAll(".nav-item").forEach(item => {
        if (item.getAttribute("data-view") === viewName) {
            item.classList.add("active");
        } else {
            item.classList.remove("active");
        }
    });

    // Toggle active sections in viewport
    document.querySelectorAll(".view-section").forEach(sec => {
        if (sec.id === `view-${viewName}`) {
            sec.classList.add("active");
        } else {
            sec.classList.remove("active");
        }
    });

    // Update header title text
    const titleDictKey = `nav_${viewName}`;
    const headerTitle = document.getElementById("page-title");
    headerTitle.innerText = TRANSLATIONS[APP_STATE.language][titleDictKey] || viewName;
    
    renderActiveView();
}

function renderActiveView() {
    if (!APP_STATE.unlocked || !APP_STATE.profile) return;

    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    switch (APP_STATE.activeView) {
        case "home":
            renderTripContent();
            renderHistoricalStats();
            break;
        case "gallery":
            renderGallery();
            break;
        case "profile":
            renderProfilePage();
            break;
        case "finance":
            renderFinanceSimulator();
            break;
        case "quiz":
            renderQuizGame();
            break;
        case "jeopardy":
            renderJeopardyGame();
            break;
        case "voting":
            renderVotingGame();
            break;
    }
    lucide.createIcons();
}


// ==========================================================================
// HOME VIEW: TRIP REPORT CARDS & HISTORIC TABLES
// ==========================================================================

function initTripTabs() {
    const tabBtns = document.querySelectorAll("#trip-tabs .tab-btn");
    tabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            tabBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            APP_STATE.activeTrip = btn.getAttribute("data-trip");
            renderTripContent();
        });
    });
}

function renderTripContent() {
    const container = document.getElementById("trip-content");
    const trip = TRIP_DATA[APP_STATE.activeTrip];
    if (!trip) return;

    let html = `
        <div class="trip-summary-box animate-fade-in">
            <div class="trip-metric-card">
                <div class="trip-metric-label">Voto Medio</div>
                <div class="trip-metric-val">${trip.stats.avg}</div>
            </div>
            <div class="trip-metric-card">
                <div class="trip-metric-label">Top Voto</div>
                <div class="trip-metric-val">${trip.stats.top}</div>
            </div>
            <div class="trip-metric-card">
                <div class="trip-metric-label">Partecipanti</div>
                <div class="trip-metric-val">${trip.stats.participants}</div>
            </div>
            <div class="trip-metric-card">
                <div class="trip-metric-label">Luogo</div>
                <div class="trip-metric-val" style="font-size:1.1rem; font-weight:700; margin-top:4px;">${trip.stats.location}</div>
            </div>
        </div>
        
        <div class="members-grid animate-fade-in">
    `;

    trip.reports.forEach((report, index) => {
        html += `
            <div class="member-report-card" data-index="${index}">
                <div class="member-card-header">
                    <div>
                        <h4 class="member-card-title">${report.name}</h4>
                        <span class="member-card-subtitle">${report.nick}</span>
                    </div>
                    <span class="grade-badge">${report.grade}</span>
                </div>
                <p class="member-card-body">${report.desc}</p>
                <div class="card-expand-indicator">
                    <i data-lucide="chevron-down"></i>
                </div>
            </div>
        `;
    });

    html += `</div>`;
    container.innerHTML = html;

    // Attach click events for card expanding
    const cards = container.querySelectorAll(".member-report-card");
    cards.forEach(card => {
        card.addEventListener("click", () => {
            card.classList.toggle("expanded");
            const icon = card.querySelector(".card-expand-indicator i");
            if (card.classList.contains("expanded")) {
                icon.setAttribute("data-lucide", "chevron-up");
            } else {
                icon.setAttribute("data-lucide", "chevron-down");
            }
            lucide.createIcons();
        });
    });
    lucide.createIcons();
}

function renderHistoricalStats() {
    // Top Voti List
    const topVotiList = document.getElementById("stats-top-voti-list");
    topVotiList.innerHTML = STATS_TOP_VOTI.map((item, i) => `
        <li>
            <span>${i+1}. <strong>${item.name}</strong> (${item.trip})</span>
            <strong>${item.grade}</strong>
        </li>
    `).join("");

    // Presenze List
    const presenzeList = document.getElementById("stats-presenze-list");
    presenzeList.innerHTML = STATS_PRESENZE.map((item) => `
        <li>
            <span><strong>${item.name}</strong></span>
            <span>${item.count} vacanze</span>
        </li>
    `).join("");

    // Classifica Medie List
    const medieList = document.getElementById("stats-medie-list");
    medieList.innerHTML = STATS_MEDIE.map((item, i) => `
        <li>
            <span>${i+1}. <strong>${item.name}</strong> (${item.trips} vacanze)</span>
            <strong>${item.avg}</strong>
        </li>
    `).join("");
}


// ==========================================================================
// MEMBERS GALLERY VIEW
// ==========================================================================

function initGallery() {
    renderGallery();
}

function renderGallery() {
    const container = document.getElementById("gallery-grid-container");
    if (!container) return;
    
    container.innerHTML = "";
    
    MAIN_MEMBERS.forEach(member => {
        const info = MEMBER_INFO[member];
        const card = document.createElement("div");
        card.className = "gallery-card animate-fade-in";
        card.innerHTML = `
            <div class="gallery-img-wrapper">
                <img src="${info.image}" alt="${member}" onerror="this.src='https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&h=300&q=80'">
            </div>
            <div class="gallery-card-info">
                <h4 class="gallery-card-name">${member}</h4>
                <span class="gallery-card-tag">${info.timeline[info.timeline.length-1].nick}</span>
            </div>
        `;
        
        card.addEventListener("click", () => {
            APP_STATE.profile = member;
            localStorage.setItem("ap88_profile", member);
            updateUIForCurrentUser();
            navigateTo("profile");
        });
        
        container.appendChild(card);
    });
}


// ==========================================================================
// PROFILE PAGE (PERSONAL TIMELINE & STATS)
// ==========================================================================

function renderProfilePage() {
    const isGuest = APP_STATE.profile === "Guest";
    const guestMsg = document.getElementById("guest-profile-msg");
    const userPanel = document.getElementById("user-profile-panel");
    
    if (isGuest) {
        guestMsg.classList.remove("hidden");
        userPanel.classList.add("hidden");
        return;
    }
    
    guestMsg.classList.add("hidden");
    userPanel.classList.remove("hidden");
    
    const info = MEMBER_INFO[APP_STATE.profile];
    if (!info) return;
    
    // Sidebar card info
    document.getElementById("profile-user-img").src = info.image;
    document.getElementById("profile-user-name").innerText = info.name;
    
    const nicksContainer = document.getElementById("profile-user-nicks");
    nicksContainer.innerHTML = info.nicknames.map(nick => `
        <span class="nickname-tag">${nick}</span>
    `).join("");
    
    // Statistics values
    document.getElementById("profile-stat-trips").innerText = info.stats.trips;
    document.getElementById("profile-stat-avg").innerText = info.stats.avg;
    document.getElementById("profile-stat-max").innerText = info.stats.max;
    document.getElementById("profile-stat-best").innerText = info.stats.best;
    
    // Timeline history
    const timelineContainer = document.getElementById("profile-timeline-container");
    timelineContainer.innerHTML = info.timeline.map(item => `
        <div class="timeline-item">
            <span class="timeline-dot"></span>
            <div class="timeline-header">
                <h4 class="timeline-title">${item.trip}</h4>
                <span class="timeline-grade">${item.grade} (${item.nick})</span>
            </div>
            <p class="timeline-desc">${item.desc}</p>
        </div>
    `).join("");
}


// ==========================================================================
// QUIZ GAME: "IL RE DELLE PAGELLE"
// ==========================================================================

let activeQuizQuestion = null;

function initGames() {
    // Quiz bindings
    document.getElementById("quiz-start-btn").addEventListener("click", startQuizGame);
    document.getElementById("quiz-next-btn").addEventListener("click", nextQuizQuestion);
    document.getElementById("quiz-restart-btn").addEventListener("click", restartQuizGame);
    
    // Jeopardy bindings
    document.getElementById("jeopardy-players-count").addEventListener("input", rebuildJeopardyPlayersInputs);
    document.getElementById("jeopardy-start-btn").addEventListener("click", startJeopardyGame);
    document.getElementById("jeopardy-new-game-btn").addEventListener("click", resetJeopardyToSetup);
    
    document.getElementById("jeopardy-reveal-btn").addEventListener("click", revealJeopardyAnswer);
    document.getElementById("jeopardy-yes-btn").addEventListener("click", () => answerJeopardyQuestion(true));
    document.getElementById("jeopardy-no-btn").addEventListener("click", () => answerJeopardyQuestion(false));
    
    // Voting bindings
    document.getElementById("voting-players-count").addEventListener("input", rebuildVotingPlayersInputs);
    document.getElementById("voting-start-btn").addEventListener("click", startVotingGame);
    document.getElementById("voting-next-btn").addEventListener("click", loadNextVotingQuestion);
    document.getElementById("voting-reset-btn").addEventListener("click", resetVotingToSetup);
    
    // Setup inputs dynamically on start
    rebuildJeopardyPlayersInputs();
    rebuildVotingPlayersInputs();
}

function renderQuizGame() {
    const setupPanel = document.getElementById("quiz-setup-panel");
    const gamePanel = document.getElementById("quiz-game-panel");
    const resultsPanel = document.getElementById("quiz-results-panel");
    
    if (!APP_STATE.quiz.gameStarted) {
        setupPanel.classList.remove("hidden");
        gamePanel.classList.add("hidden");
        resultsPanel.classList.add("hidden");
    } else if (APP_STATE.quiz.gameOver) {
        setupPanel.classList.add("hidden");
        gamePanel.classList.add("hidden");
        resultsPanel.classList.remove("hidden");
        
        // Show winner message
        const s1 = APP_STATE.quiz.team1Score;
        const s2 = APP_STATE.quiz.team2Score;
        const winnerMsg = document.getElementById("quiz-winner-msg");
        
        if (s1 > s2) {
            winnerMsg.innerHTML = `🏆 Vince la <strong>${APP_STATE.quiz.team1Name}</strong> con ${s1} punti!`;
        } else if (s2 > s1) {
            winnerMsg.innerHTML = `🏆 Vince la <strong>${APP_STATE.quiz.team2Name}</strong> con ${s2} punti!`;
        } else {
            winnerMsg.innerHTML = `Pareggio! Entrambe le squadre hanno totalizzato ${s1} punti.`;
        }
        
        document.getElementById("quiz-final-team1-name").innerText = APP_STATE.quiz.team1Name;
        document.getElementById("quiz-final-team1-score").innerText = s1;
        document.getElementById("quiz-final-team2-name").innerText = APP_STATE.quiz.team2Name;
        document.getElementById("quiz-final-team2-score").innerText = s2;
    } else {
        setupPanel.classList.add("hidden");
        gamePanel.classList.remove("hidden");
        resultsPanel.classList.add("hidden");
        
        // Render current question
        document.getElementById("quiz-display-team1-name").innerText = APP_STATE.quiz.team1Name;
        document.getElementById("quiz-display-team1-score").innerText = APP_STATE.quiz.team1Score;
        document.getElementById("quiz-display-team2-name").innerText = APP_STATE.quiz.team2Name;
        document.getElementById("quiz-display-team2-score").innerText = APP_STATE.quiz.team2Score;
        
        document.getElementById("quiz-question-index").innerText = `Domanda ${APP_STATE.quiz.questionCount + 1}/20`;
        document.getElementById("quiz-question-source").innerText = activeQuizQuestion.source;
        
        const turnTeam = APP_STATE.quiz.currentTeam === 1 ? APP_STATE.quiz.team1Name : APP_STATE.quiz.team2Name;
        document.getElementById("quiz-current-turn-msg").innerText = `Turno della squadra: ${turnTeam}`;
        
        document.getElementById("quiz-question-text").innerText = activeQuizQuestion.question;
        
        // Render choices
        const choicesGrid = document.getElementById("quiz-options-container");
        choicesGrid.innerHTML = "";
        
        activeQuizQuestion.options.forEach(opt => {
            const btn = document.createElement("button");
            btn.className = "quiz-option-btn";
            btn.innerText = opt;
            
            if (APP_STATE.quiz.selectedAnswer !== null) {
                btn.disabled = true;
                if (opt === activeQuizQuestion.correct) {
                    btn.classList.add("correct-choice");
                } else if (opt === APP_STATE.quiz.selectedAnswer) {
                    btn.classList.add("incorrect-choice");
                }
            } else {
                btn.addEventListener("click", () => selectQuizAnswer(opt));
            }
            
            choicesGrid.appendChild(btn);
        });
        
        // Feedback panel
        const feedback = document.getElementById("quiz-feedback");
        if (APP_STATE.quiz.selectedAnswer !== null) {
            feedback.classList.remove("hidden");
            const feedbackMsg = document.getElementById("quiz-feedback-msg");
            if (APP_STATE.quiz.selectedAnswer === activeQuizQuestion.correct) {
                feedbackMsg.innerText = "✅ Esatto!";
                feedbackMsg.className = "correct-msg";
            } else {
                feedbackMsg.innerText = `❌ Sbagliato! La risposta corretta era: ${activeQuizQuestion.correct}`;
                feedbackMsg.className = "incorrect-msg";
            }
        } else {
            feedback.classList.add("hidden");
        }
    }
}

function startQuizGame() {
    const t1 = document.getElementById("quiz-team1-name").value.trim() || "Squadra 1";
    const t2 = document.getElementById("quiz-team2-name").value.trim() || "Squadra 2";
    
    APP_STATE.quiz.gameStarted = true;
    APP_STATE.quiz.gameOver = false;
    APP_STATE.quiz.team1Name = t1;
    APP_STATE.quiz.team2Name = t2;
    APP_STATE.quiz.team1Score = 0;
    APP_STATE.quiz.team2Score = 0;
    APP_STATE.quiz.questionCount = 0;
    APP_STATE.quiz.questionsUsed.clear();
    APP_STATE.quiz.currentTeam = 1;
    APP_STATE.quiz.selectedAnswer = null;
    
    loadNextQuizQuestion();
    renderQuizGame();
}

function loadNextQuizQuestion() {
    const available = QUIZ_QUESTIONS.filter(q => !APP_STATE.quiz.questionsUsed.has(q.question));
    if (available.length === 0 || APP_STATE.quiz.questionCount >= 20) {
        APP_STATE.quiz.gameOver = true;
        return;
    }
    
    const chosen = available[Math.floor(Math.random() * available.length)];
    APP_STATE.quiz.questionsUsed.add(chosen.question);
    activeQuizQuestion = chosen;
}

function selectQuizAnswer(answer) {
    APP_STATE.quiz.selectedAnswer = answer;
    if (answer === activeQuizQuestion.correct) {
        if (APP_STATE.quiz.currentTeam === 1) {
            APP_STATE.quiz.team1Score++;
        } else {
            APP_STATE.quiz.team2Score++;
        }
    }
    renderQuizGame();
}

function nextQuizQuestion() {
    APP_STATE.quiz.questionCount++;
    APP_STATE.quiz.selectedAnswer = null;
    APP_STATE.quiz.currentTeam = APP_STATE.quiz.currentTeam === 1 ? 2 : 1;
    
    loadNextQuizQuestion();
    renderQuizGame();
}

function restartQuizGame() {
    APP_STATE.quiz.gameStarted = false;
    APP_STATE.quiz.gameOver = false;
    renderQuizGame();
}


// ==========================================================================
// GAME 2: JEOPARDY BOARD
// ==========================================================================

function rebuildJeopardyPlayersInputs() {
    const count = parseInt(document.getElementById("jeopardy-players-count").value) || 1;
    const container = document.getElementById("jeopardy-players-names-container");
    container.innerHTML = "";
    
    for (let i = 0; i < count; i++) {
        const div = document.createElement("div");
        div.className = "form-group";
        div.innerHTML = `
            <label for="jeopardy-p-${i}">Nome Giocatore ${i+1}</label>
            <input type="text" id="jeopardy-p-${i}" value="Giocatore ${i+1}">
        `;
        container.appendChild(div);
    }
}

function startJeopardyGame() {
    const charSelect = document.getElementById("jeopardy-character-select").value;
    if (charSelect !== "Girla") {
        alert("Scusa! La board Jeopardy per questo personaggio è in fase di sviluppo. Gioca con Girla!");
        return;
    }
    
    const count = parseInt(document.getElementById("jeopardy-players-count").value) || 1;
    const players = [];
    const scores = {};
    
    for (let i = 0; i < count; i++) {
        const val = document.getElementById(`jeopardy-p-${i}`).value.trim() || `Giocatore ${i+1}`;
        players.push(val);
        scores[val] = 0;
    }
    
    APP_STATE.jeopardy.selectedCharacter = charSelect;
    APP_STATE.jeopardy.players = players;
    APP_STATE.jeopardy.scores = scores;
    APP_STATE.jeopardy.gameStarted = true;
    APP_STATE.jeopardy.gameOver = false;
    APP_STATE.jeopardy.answeredQuestions.clear();
    APP_STATE.jeopardy.currentQuestion = null;
    APP_STATE.jeopardy.showAnswer = false;
    APP_STATE.jeopardy.currentTurnPlayerIndex = 0;
    
    renderJeopardyGame();
}

function renderJeopardyGame() {
    const setupPanel = document.getElementById("jeopardy-setup-panel");
    const gamePanel = document.getElementById("jeopardy-game-panel");
    const resultsPanel = document.getElementById("jeopardy-results-panel");
    
    if (!APP_STATE.jeopardy.gameStarted) {
        setupPanel.classList.remove("hidden");
        gamePanel.classList.add("hidden");
        resultsPanel.classList.add("hidden");
    } else if (APP_STATE.jeopardy.gameOver) {
        setupPanel.classList.add("hidden");
        gamePanel.classList.add("hidden");
        resultsPanel.classList.remove("hidden");
        
        // Show scoreboard
        const list = document.getElementById("jeopardy-final-scores-list");
        const sorted = Object.entries(APP_STATE.jeopardy.scores).sort((a,b) => b[1] - a[1]);
        list.innerHTML = sorted.map(([name, score], i) => `
            <div class="score-row">
                <span>${i+1}. <strong>${name}</strong></span>
                <strong>${score} Punti</strong>
            </div>
        `).join("");
    } else {
        setupPanel.classList.add("hidden");
        gamePanel.classList.remove("hidden");
        resultsPanel.classList.add("hidden");
        
        // Render scoreboard
        const scoreboard = document.getElementById("jeopardy-scoreboard");
        scoreboard.innerHTML = APP_STATE.jeopardy.players.map((name, i) => {
            const activeClass = i === APP_STATE.jeopardy.currentTurnPlayerIndex ? "active" : "";
            return `
                <div class="jeopardy-player-badge ${activeClass}">
                    <span>${name}</span>
                    <strong class="jeopardy-player-score">${APP_STATE.jeopardy.scores[name]}</strong>
                </div>
            `;
        }).join("");
        
        // Turn banner
        const activeName = APP_STATE.jeopardy.players[APP_STATE.jeopardy.currentTurnPlayerIndex];
        document.getElementById("jeopardy-turn-banner").innerText = `Turno di: ${activeName}`;
        
        // Render Board
        const board = document.getElementById("jeopardy-board");
        board.innerHTML = "";
        
        // 1. Categories Row headers
        JEOPARDY_CATEGORIES.forEach(cat => {
            const el = document.createElement("div");
            el.className = "jeopardy-cell category-header";
            el.innerText = cat;
            board.appendChild(el);
        });
        
        // 2. Point cells grid (5 rows: 100, 200, 300, 400, 500)
        const rowPoints = [100, 200, 300, 400, 500];
        
        for (let rowIndex = 0; rowIndex < 5; rowIndex++) {
            const pointsVal = rowPoints[rowIndex];
            for (let catIndex = 0; catIndex < 5; catIndex++) {
                const key = `${catIndex}_${rowIndex}`;
                const el = document.createElement("div");
                
                if (APP_STATE.jeopardy.answeredQuestions.has(key)) {
                    el.className = "jeopardy-cell point-value disabled";
                    el.innerText = "-";
                } else {
                    el.className = "jeopardy-cell point-value";
                    el.innerText = pointsVal;
                    el.addEventListener("click", () => openJeopardyQuestion(catIndex, rowIndex));
                }
                
                board.appendChild(el);
            }
        }
    }
}

function openJeopardyQuestion(catIndex, rowIndex) {
    const key = `${catIndex}_${rowIndex}`;
    const questionData = JEOPARDY_QUESTIONS[key];
    if (!questionData) return;
    
    APP_STATE.jeopardy.currentQuestion = [catIndex, rowIndex];
    APP_STATE.jeopardy.showAnswer = false;
    
    // Fill modal info
    document.getElementById("jeopardy-modal-category").innerText = questionData.category;
    document.getElementById("jeopardy-modal-points").innerText = `${questionData.value} Punti`;
    document.getElementById("jeopardy-modal-question").innerText = questionData.question;
    document.getElementById("jeopardy-modal-answer").innerText = questionData.answer;
    
    // Show/hide areas
    document.getElementById("jeopardy-reveal-area").classList.remove("hidden");
    document.getElementById("jeopardy-answer-area").classList.add("hidden");
    
    // Open modal container
    document.getElementById("jeopardy-modal").classList.remove("hidden");
}

function revealJeopardyAnswer() {
    APP_STATE.jeopardy.showAnswer = true;
    document.getElementById("jeopardy-reveal-area").classList.add("hidden");
    document.getElementById("jeopardy-answer-area").classList.remove("hidden");
}

function answerJeopardyQuestion(wasCorrect) {
    const [catIndex, rowIndex] = APP_STATE.jeopardy.currentQuestion;
    const key = `${catIndex}_${rowIndex}`;
    const questionData = JEOPARDY_QUESTIONS[key];
    
    const activePlayerName = APP_STATE.jeopardy.players[APP_STATE.jeopardy.currentTurnPlayerIndex];
    
    if (wasCorrect) {
        APP_STATE.jeopardy.scores[activePlayerName] += questionData.value;
    } else {
        APP_STATE.jeopardy.scores[activePlayerName] -= questionData.value;
    }
    
    APP_STATE.jeopardy.answeredQuestions.add(key);
    APP_STATE.jeopardy.currentQuestion = null;
    
    // Close modal
    document.getElementById("jeopardy-modal").classList.add("hidden");
    
    // Check if game over
    const maxQuestions = getJeopardyMaxQuestions(APP_STATE.jeopardy.players.length);
    if (APP_STATE.jeopardy.answeredQuestions.size >= maxQuestions || APP_STATE.jeopardy.answeredQuestions.size === 25) {
        APP_STATE.jeopardy.gameOver = true;
    } else {
        // Next player turn
        APP_STATE.jeopardy.currentTurnPlayerIndex = (APP_STATE.jeopardy.currentTurnPlayerIndex + 1) % APP_STATE.jeopardy.players.length;
    }
    
    renderJeopardyGame();
}

function getJeopardyMaxQuestions(numPlayers) {
    if (numPlayers === 1 || numPlayers === 4 || numPlayers === 5) return 25;
    if (numPlayers === 2 || numPlayers === 3 || numPlayers === 6 || numPlayers === 8) return 24;
    if (numPlayers === 7) return 21;
    return 25;
}

function resetJeopardyToSetup() {
    APP_STATE.jeopardy.gameStarted = false;
    APP_STATE.jeopardy.gameOver = false;
    renderJeopardyGame();
}


// ==========================================================================
// GAME 3: SECRET VOTING GAME ("LITIGHIAMO")
// ==========================================================================

let votingChartInstance = null;

function rebuildVotingPlayersInputs() {
    const count = parseInt(document.getElementById("voting-players-count").value) || 2;
    const container = document.getElementById("voting-players-names-container");
    container.innerHTML = "";
    
    for (let i = 0; i < count; i++) {
        const div = document.createElement("div");
        div.className = "form-group";
        div.innerHTML = `
            <label for="voting-p-${i}">Partecipante ${i+1}</label>
            <input type="text" id="voting-p-${i}" value="Giocatore ${i+1}">
        `;
        container.appendChild(div);
    }
}

function startVotingGame() {
    const count = parseInt(document.getElementById("voting-players-count").value) || 2;
    const participants = [];
    
    for (let i = 0; i < count; i++) {
        const val = document.getElementById(`voting-p-${i}`).value.trim() || `Giocatore ${i+1}`;
        participants.push(val);
    }
    
    APP_STATE.voting.participants = participants;
    APP_STATE.voting.gameStarted = true;
    APP_STATE.voting.gameOver = false;
    APP_STATE.voting.currentVoterIndex = 0;
    APP_STATE.voting.questionsUsed.clear();
    APP_STATE.voting.votes = {};
    APP_STATE.voting.roundResults = {};
    
    participants.forEach(p => {
        APP_STATE.voting.roundResults[p] = 0;
    });
    
    loadNewVotingQuestion();
    renderVotingGame();
}

function loadNewVotingQuestion() {
    const available = VOTING_QUESTIONS.filter(q => !APP_STATE.voting.questionsUsed.has(q));
    if (available.length === 0) {
        alert("Tutte le domande sono state usate!");
        resetVotingToSetup();
        return;
    }
    
    const chosen = available[Math.floor(Math.random() * available.length)];
    APP_STATE.voting.questionsUsed.add(chosen);
    APP_STATE.voting.currentQuestion = chosen;
    APP_STATE.voting.currentVoterIndex = 0;
    APP_STATE.voting.votes = {};
    
    APP_STATE.voting.participants.forEach(p => {
        APP_STATE.voting.roundResults[p] = 0;
    });
}

function renderVotingGame() {
    const setupPanel = document.getElementById("voting-setup-panel");
    const gamePanel = document.getElementById("voting-game-panel");
    const resultsPanel = document.getElementById("voting-results-panel");
    
    if (!APP_STATE.voting.gameStarted) {
        setupPanel.classList.remove("hidden");
        gamePanel.classList.add("hidden");
        resultsPanel.classList.add("hidden");
    } else if (APP_STATE.voting.gameOver) {
        setupPanel.classList.add("hidden");
        gamePanel.classList.add("hidden");
        resultsPanel.classList.remove("hidden");
        
        // Fill results info
        document.getElementById("voting-results-question-text").innerText = APP_STATE.voting.currentQuestion;
        
        // Render votes details table
        const tbody = document.getElementById("voting-details-table-body");
        tbody.innerHTML = Object.entries(APP_STATE.voting.votes).map(([voter, voted]) => `
            <tr>
                <td><strong>${voter}</strong></td>
                <td><span class="badge badge-accent">${voted}</span></td>
            </tr>
        `).join("");
        
        // Draw Chart.js votes graph
        setTimeout(renderVotingChart, 50);
        
    } else {
        setupPanel.classList.add("hidden");
        gamePanel.classList.remove("hidden");
        resultsPanel.classList.add("hidden");
        
        // Display current question
        document.getElementById("voting-question-text").innerText = APP_STATE.voting.currentQuestion;
        
        // Turn info
        const activeVoterName = APP_STATE.voting.participants[APP_STATE.voting.currentVoterIndex];
        document.getElementById("voting-current-voter").innerText = activeVoterName.toUpperCase();
        
        // Render vote buttons (can choose any participant)
        const container = document.getElementById("voting-options-container");
        container.innerHTML = "";
        
        APP_STATE.voting.participants.forEach(p => {
            const btn = document.createElement("button");
            btn.className = "voting-btn";
            btn.innerText = p;
            btn.addEventListener("click", () => submitVote(activeVoterName, p));
            container.appendChild(btn);
        });
    }
}

function submitVote(voter, voted) {
    APP_STATE.voting.votes[voter] = voted;
    APP_STATE.voting.roundResults[voted]++;
    
    APP_STATE.voting.currentVoterIndex++;
    
    if (APP_STATE.voting.currentVoterIndex >= APP_STATE.voting.participants.length) {
        APP_STATE.voting.gameOver = true;
    }
    
    renderVotingGame();
}

function renderVotingChart() {
    const ctx = document.getElementById("voting-chart");
    if (!ctx) return;
    
    if (votingChartInstance) {
        votingChartInstance.destroy();
    }
    
    const dataSet = Object.entries(APP_STATE.voting.roundResults).sort((a,b) => b[1] - a[1]);
    const labels = dataSet.map(d => d[0]);
    const votes = dataSet.map(d => d[1]);
    
    const isDark = document.documentElement.getAttribute("data-theme") === 'dark';
    const textColor = isDark ? '#f8f8f8' : '#1e1e1e';
    const gridColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
    
    votingChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Voti Ricevuti',
                data: votes,
                backgroundColor: 'rgba(244, 67, 54, 0.75)',
                borderColor: 'rgba(244, 67, 54, 1)',
                borderWidth: 1.5,
                borderRadius: 8
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: {
                    grid: { color: gridColor },
                    ticks: {
                        color: textColor,
                        stepSize: 1,
                        precision: 0
                    }
                },
                y: {
                    grid: { display: false },
                    ticks: { color: textColor }
                }
            }
        }
    });
}

function loadNextVotingQuestion() {
    loadNewVotingQuestion();
    APP_STATE.voting.gameOver = false;
    renderVotingGame();
}

function resetVotingToSetup() {
    APP_STATE.voting.gameStarted = false;
    APP_STATE.voting.gameOver = false;
    renderVotingGame();
}


// ==========================================================================
// PILLOLE DI FINANZA: COMPOUND INTEREST SIMULATOR
// ==========================================================================

let financeChartInstance = null;

function initFinanceSimulator() {
    const capitalInput = document.getElementById("sim-initial-capital");
    const monthlyInput = document.getElementById("sim-monthly-investment");
    const yearsInput = document.getElementById("sim-years");
    const returnInput = document.getElementById("sim-return");
    const inflationInput = document.getElementById("sim-inflation");
    
    if (!capitalInput) return; // Not on the DOM page load
    
    const recalculateAndRender = () => {
        // Sync range indicator values
        document.getElementById("sim-years-val").innerText = yearsInput.value;
        document.getElementById("sim-return-val").innerText = `${returnInput.value}%`;
        document.getElementById("sim-inflation-val").innerText = `${inflationInput.value}%`;
        
        calculateProjections();
    };

    [capitalInput, monthlyInput, yearsInput, returnInput, inflationInput].forEach(input => {
        input.addEventListener("input", recalculateAndRender);
    });
}

function renderFinanceSimulator() {
    calculateProjections();
}

function calculateProjections() {
    const initialCapital = parseFloat(document.getElementById("sim-initial-capital").value) || 0;
    const monthlyInvestment = parseFloat(document.getElementById("sim-monthly-investment").value) || 0;
    const years = parseInt(document.getElementById("sim-years").value) || 10;
    const annualReturn = parseFloat(document.getElementById("sim-return").value) || 0;
    const inflation = parseFloat(document.getElementById("sim-inflation").value) || 0;
    
    const months = years * 12;
    const monthlyReturn = Math.pow(1 + annualReturn / 100, 1 / 12) - 1;
    const monthlyInflation = Math.pow(1 + inflation / 100, 1 / 12) - 1;
    
    let capital = initialCapital;
    let invested = initialCapital;
    let realValue = initialCapital;
    let inflationLoss = initialCapital;
    
    const history = [];
    
    for (let month = 1; month <= months; month++) {
        capital += monthlyInvestment;
        invested += monthlyInvestment;
        capital *= (1 + monthlyReturn);
        
        realValue = capital / Math.pow(1 + monthlyInflation, month);
        inflationLoss = invested / Math.pow(1 + monthlyInflation, month);
        
        if (month % 12 === 0) {
            history.push({
                year: month / 12,
                nominal: capital,
                real: realValue,
                invested: invested,
                depreciated: invested - inflationLoss
            });
        }
    }
    
    // Update summary metrics cards
    const last = history[history.length - 1];
    
    document.getElementById("proj-total-invested").innerText = formatCurrency(last.invested);
    document.getElementById("proj-nominal-value").innerText = formatCurrency(last.nominal);
    document.getElementById("proj-real-value").innerText = formatCurrency(last.real);
    document.getElementById("proj-inflation-loss").innerText = formatCurrency(last.depreciated);
    
    // Render timeline decadal details table
    renderFinanceTable(history, years);
    
    // Draw chart datasets
    renderFinanceChart(history);
}

function formatCurrency(val) {
    return "€ " + Math.round(val).toLocaleString("it-IT");
}

function renderFinanceTable(history, totalYears) {
    const tbody = document.getElementById("finance-table-body");
    
    // Filter history to display intervals of 10 years + the final year
    const displayYears = [];
    for (let y = 10; y < totalYears; y += 10) {
        displayYears.push(y);
    }
    displayYears.push(totalYears);
    
    const rows = history.filter(h => displayYears.includes(h.year));
    
    tbody.innerHTML = rows.map(r => `
        <tr>
            <td><strong>Anno ${r.year}</strong></td>
            <td>${formatCurrency(r.invested)}</td>
            <td><strong>${formatCurrency(r.nominal)}</strong></td>
            <td><span style="color: #2196F3; font-weight:700;">${formatCurrency(r.real)}</span></td>
            <td style="color: #F44336;">${formatCurrency(r.depreciated)}</td>
        </tr>
    `).join("");
}

function renderFinanceChart(historyData) {
    const ctx = document.getElementById("finance-chart");
    if (!ctx) return;
    
    // If no history data is passed, calculate dynamically
    if (!historyData) {
        calculateProjections();
        return;
    }
    
    if (financeChartInstance) {
        financeChartInstance.destroy();
    }
    
    const labels = historyData.map(h => `Anno ${h.year}`);
    const invested = historyData.map(h => Math.round(h.invested));
    const nominal = historyData.map(h => Math.round(h.nominal));
    const real = historyData.map(h => Math.round(h.real));
    const depreciated = historyData.map(h => Math.round(h.depreciated));
    
    const isDark = document.documentElement.getAttribute("data-theme") === 'dark';
    const textColor = isDark ? '#f8f8f8' : '#1e1e1e';
    const gridColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
    
    financeChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Valore Nominale (lordo)',
                    data: nominal,
                    borderColor: '#4CAF50',
                    backgroundColor: 'rgba(76, 175, 80, 0.05)',
                    borderWidth: 2.5,
                    tension: 0.15,
                    fill: true
                },
                {
                    label: 'Valore Reale (netto inflazione)',
                    data: real,
                    borderColor: '#2196F3',
                    backgroundColor: 'rgba(33, 150, 243, 0.05)',
                    borderWidth: 2.5,
                    tension: 0.15,
                    fill: true
                },
                {
                    label: 'Totale Investito',
                    data: invested,
                    borderColor: '#FFA500',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    tension: 0,
                    fill: false
                },
                {
                    label: 'Deprizzamento per inflazione',
                    data: depreciated,
                    borderColor: '#F44336',
                    borderWidth: 1.5,
                    borderDash: [3, 3],
                    tension: 0,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: { color: textColor }
                }
            },
            scales: {
                x: {
                    grid: { color: gridColor },
                    ticks: { color: textColor }
                },
                y: {
                    grid: { color: gridColor },
                    ticks: { color: textColor }
                }
            }
        }
    });
}
