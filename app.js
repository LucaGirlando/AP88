// ==========================================================================
// STATE MANAGEMENT & DATASETS (PHASE 2 - ADVANCED SPA)
// ==========================================================================

const APP_STATE = {
    unlocked: false,
    profile: null, // "Guest", "Paci", "Girla", etc.
    adminUnlocked: false,
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
        currentTeam: 1,
        selectedAnswer: null
    },
    jeopardy: {
        gameStarted: false,
        gameOver: false,
        selectedCharacter: 'Girla',
        players: [],
        scores: {},
        answeredQuestions: new Set(),
        currentQuestion: null,
        showAnswer: false,
        currentTurnPlayerIndex: 0
    },
    voting: {
        gameStarted: false,
        gameOver: false,
        participants: [],
        votersVoted: 0,
        currentVoterIndex: 0,
        currentQuestion: '',
        questionsUsed: new Set(),
        votes: {},
        roundResults: {},
        cumulativeResults: {},
        revealDetailedVotes: false
    },
    tripvoting: {
        participants: [], // List of names
        currentVoterIndex: 0,
        votes: {}, // voter -> { target: { grade: X, comment: Y } }
        results: {}, // target -> { totalGrade: X, count: Y, comments: [] }
        stage: 'setup' // 'setup', 'prompt', 'voting', 'results'
    },
    admin: {
        tempReports: [] // Temporary reports for vacation being built
    }
};

const MAIN_MEMBERS = ["Paci", "Girla", "Paga", "Bax", "Ari", "Chiara", "Ceci", "Gaia"];

const MEMBER_COLORS = {
    Paci: '#a855f7',
    Girla: '#22c55e',
    Paga: '#f97316',
    Bax: '#3b82f6',
    Ari: '#ec4899',
    Chiara: '#eab308',
    Ceci: '#ef4444',
    Gaia: '#14b8a6'
};

const MEMBER_INFO = {
    Paci: {
        name: "Paci",
        image: "Paci.jpg",
        nicknames: ["SARDO VERO", "IL PADRINO", "IL BENEFATTORE", "COLUI CHE LA SPIEGA", "LO STOMACO DEBOLE"],
        stats: { trips: 5, avg: 8.7, max: "9.5 (Barcellona)", best: "Barcellona 24/25" }
    },
    Girla: {
        name: "Girla",
        image: "Girla.jpg",
        nicknames: ["IL T-REX", "PITA ADVISOR", "ANTHONY MARTIAL", "EHI EWA", "CIPOLLE SUDARE"],
        stats: { trips: 5, avg: 9.0, max: "9.5 (Barcellona)", best: "Barcellona 24/25" }
    },
    Paga: {
        name: "Paga",
        image: "Paga.jpg",
        nicknames: ["ER FREGOLA", "IL BARISTA", "IL MEGAFONO", "RIGATONI, NO FUSILLI", "RISO SENZA LATTOSIO"],
        stats: { trips: 5, avg: 8.6, max: "9.5 (Corfù)", best: "Corfù 2022" }
    },
    Bax: {
        name: "Bax",
        image: "Bax.jpg",
        nicknames: ["NICKI LAUDA", "IL PENGWIN", "LA ZECCA DI STATO", "DELUX", "PAPÀ V"],
        stats: { trips: 5, avg: 8.8, max: "9+ (Croazia)", best: "Croazia 2024" }
    },
    Ari: {
        name: "Ari",
        image: "Ari.jpg",
        nicknames: ["BULBASAUR", "LA CAMIONISTA", "LA BENZINAIA", "STANGA?MAGARI", "IN SMARTWORKING"],
        stats: { trips: 5, avg: 8.5, max: "10 (Barcellona)", best: "Barcellona 24/25" }
    },
    Chiara: {
        name: "Chiara",
        image: "Chiara.jpg",
        nicknames: ["LO GNOCCO", "BIG ROM", "LA PART-TIME", "AMMAN"],
        stats: { trips: 4, avg: 8.0, max: "8+ (Corfù)", best: "Corfù 2022" }
    },
    Ceci: {
        name: "Ceci",
        image: "Ceci.jpg",
        nicknames: ["@JACOGILA", "THE WEEKEND", "LA CAFONA", "LA RADIOLINA"],
        stats: { trips: 4, avg: 8.4, max: "9+ (Barcellona)", best: "Barcellona 24/25" }
    },
    Gaia: {
        name: "Gaia",
        image: "Gaia.jpg",
        nicknames: ["LA LAVASTOVIGLIE", "LA POETESSA", "DORAEMON"],
        stats: { trips: 3, avg: 8.17, max: "9 (Corfù)", best: "Corfù 2022" }
    }
};

const TRIP_DATA = {
    sardegna2021: {
        title: { it: "🇮🇹 Sardegna 2021", en: "🇮🇹 Sardinia 2021" },
        stats: { avg: 8.3, top: "10 (Trave)", participants: 11, duration: "7 giorni", location: "San Teodoro" },
        reports: [
            {
                name: "Trave",
                nick: { it: "DARIO LAMPA", en: "DARIO LAMPA" },
                grade: "10",
                desc: {
                    it: "Regala spettacolo ai tifosi ogni giorno, gioca con una tranquillità da vero campione; calmo come il mare in sardegna con il maestrale. Gli dedicano una via a san teodoro dopo il tentato omicidio di girla e le casse di birra facendo manovra.",
                    en: "Puts on a show for the fans every day, playing with the calmness of a true champion; calm as the Sardinian sea during mistral wind. They dedicate a street to him in San Teodoro after Girla's attempted murder and the beer crates while maneuvering."
                }
            },
            {
                name: "Miglio",
                nick: { it: "THE MASK", en: "THE MASK" },
                grade: "9",
                desc: {
                    it: "9 come i chili persi sboccando come un vulcano. Insieme a girla guida la wave del risparmio e torna a casa in positivo di 25 centesimi.",
                    en: "9 like the kilograms lost vomiting like a volcano. Together with Girla, he leads the wave of saving money and goes home up 25 cents."
                }
            },
            {
                name: "Ari",
                nick: { it: "BULBASAUR", en: "BULBASAUR" },
                grade: "7.5",
                desc: {
                    it: "Qualche snitchata di troppo le fa crescere le treccine colorate alla 69. Quando non dorme è simpatica come quelli delle prevendite in spiaggia.",
                    en: "A few too many snitchings make her grow colored braids à la 69. When she isn't sleeping, she is as pleasant as the beach ticket promoters."
                }
            },
            {
                name: "Ceci",
                nick: { it: "@JACOGILA", en: "@JACOGILA" },
                grade: "8",
                desc: {
                    it: "C'è un po' di ceci in questo jacopo; il suo apparecchio puzza come l'acqua di porto ottiolu, in casa è utile come l'ombrellone con 50 km/h di vento. Mezzo voto in più per la scopata sul letto di trave.",
                    en: "There's a bit of Ceci in this Jacopo; her braces smell like Porto Ottiolu's water, in the house she's as useful as a beach umbrella with 50 km/h winds. Half a grade extra for the shag on Trave's bed."
                }
            },
            {
                name: "Paga",
                nick: { it: "ER FREGOLA", en: "ER FREGOLA" },
                grade: "8",
                desc: {
                    it: "Mangia di notte carciofini e funghi a non finire. Il pagafigometro è alle stelle ma si esaurisce in una sola poppata con la marti. Sforna più nuggets del MC ma non viene assunto per mancanza di laurea.",
                    en: "Eats artichokes and mushrooms at night without end. The pagafigometer is through the roof but runs out in a single poppata with Marti. Cooks more nuggets than McDonalds but isn't hired due to lacking a degree."
                }
            },
            {
                name: "Chiara",
                nick: { it: "LO GNOCCO", en: "LO GNOCCO" },
                grade: "8+",
                desc: {
                    it: "Sta ancora cercando il computer per vedere le olimpiadi. Alterna lamentele ad ordini con picchi di altruismo saltuari. È ancora a porto rotondo ad aspettare gli spaghetti alle vongole.",
                    en: "Still looking for the computer to watch the Olympics. Alternates complaints and orders with occasional peaks of altruism. Still in Porto Rotondo waiting for spaghetti with clams."
                }
            },
            {
                name: "Bax",
                nick: { it: "NICKI LAUDA", en: "NICKI LAUDA" },
                grade: "8.5",
                desc: {
                    it: "Recupera in fretta dall'infortunio per esserci e guidare la squadra con la sua puma infuocata. Non vuole i soldi della cauzione perché non è un poveraccio. Mezzo punto in meno per il gommone rotto.",
                    en: "Recovers quickly from his injury to be there and lead the team with his fiery Puma. Doesn't want the deposit money because he's not a poor guy. Half a point less for the broken dinghy."
                }
            },
            {
                name: "Gaia",
                nick: { it: "LA LAVASTOVIGLIE", en: "LA LAVASTOVIGLIE" },
                grade: "7.5",
                desc: {
                    it: "Cauzione a rischio per il bicchiere rotto; è un'amante delle spiagge sconosciute. Difficilmente ha gli occhi aperti dopo il tramonto ma recupera in cucina.",
                    en: "Deposit at risk for the broken glass; she is a lover of unknown beaches. Hard to keep her eyes open after sunset but recovers in the kitchen."
                }
            },
            {
                name: "Auro & Gio",
                nick: { it: "LUNATICHE", en: "LUNATICHE" },
                grade: "7.5",
                desc: {
                    it: "Incollate come gemelli siamesi, si completano a vicenda una aumentando il numero di canne giornaliere e l'altra iniziando a tatuarsi.",
                    en: "Glued together like Siamese twins, they complete each other: one increases the daily count of joints and the other starts getting tattooed."
                }
            },
            {
                name: "Paci",
                nick: { it: "SARDO VERO: EJA", en: "TRUE SARDINIAN: EJA" },
                grade: "8",
                desc: {
                    it: "Conclude il suo mese di permanenza raggiungendo quasi la cittadinanza onoraria, festeggia la settimana da fidanzato non nel migliore dei modi, ma a tutti gli effetti risultata il miglior cagatore e il mastro cannaiolo.",
                    en: "Concludes his month of stay almost reaching honorary citizenship, celebrates his week as a boyfriend not in the best way, but in all respects results as the best cagatore and the master joint roller."
                }
            },
            {
                name: "Girla",
                nick: { it: "IL T-REX", en: "THE T-REX" },
                grade: "9",
                desc: {
                    it: "Crea grossi meme per tutta la vacanza, si riscopre artista, ma resta umile rimanendo l'uomo del filtro, tranne la sera di san Lorenzo nella quale si improvvisa tiratore scelto. Batte miglio tornando in positivo di 26 centesimi.",
                    en: "Creates massive memes throughout the vacation, rediscovers himself as an artist, but stays humble remaining the filter guy, except on the night of San Lorenzo when he improvises as a marksman. Beats Miglio, going home up 26 cents."
                }
            }
        ]
    },
    corfu2022: {
        title: { it: "🇬🇷 Corfù 2022", en: "🇬🇷 Corfu 2022" },
        stats: { avg: 8.7, top: "9.5 (Paga)", participants: 9, duration: "8 giorni", location: "Corfù, Grecia" },
        reports: [
            {
                name: "Trave",
                nick: { it: "IL TIKTOKER", en: "THE TIKTOKER" },
                grade: "9",
                desc: {
                    it: "Entusiasmo alle stelle per lui, riesce a svincolarsi a parametro zero prima della partenza e parla con ogni essere vivente con i capelli mediamente lunghi improvvisandosi Nikola Greku. Dopo serate di riscaldamento l'ultima sera si presenta sul dischetto e non sbaglia. Un punto in più per aver rinunciato ad albume e minchiate proteiche.",
                    en: "Enthusiasm through the roof, signs on a free transfer before departure and talks to every living being with moderately long hair, improvising as Nikola Greku. After warmup nights, he steps up to the penalty spot on the last night and doesn't miss. Plus one point for giving up egg whites and protein bullshit."
                }
            },
            {
                name: "Ari",
                nick: { it: "LA CAMIONISTA", en: "THE TRUCK DRIVER" },
                grade: "8",
                desc: {
                    it: "Situazione sentimentale inizialmente in dubbio ma chiarita appena in tempo e questo fa sì che passi una settimana mediamente tranquilla, esibendosi in uscite come vaffanculo, cazzo e porca troia a greci che però l'italiano lo capiscono. Non resiste più di due minuti senza parlare di sesso e in quei due minuti parla di Giulio. Nonostante l'infortunio nel finale non rinuncia al suo pacchetto di heets giornaliero a 4€.",
                    en: "Relationship status initially in doubt but cleared up just in time, leading to a moderately quiet week, expressing herself with 'vaffanculo', 'cazzo', and 'porca troia' to Greeks who actually understood Italian. Can't resist more than two minutes without talking about sex, and in those two minutes she talks about Giulio. Despite her final injury, she doesn't give up her daily pack of heets at 4€."
                }
            },
            {
                name: "Ceci",
                nick: { it: "THE WEEKEND", en: "THE WEEKEND" },
                grade: "8",
                desc: {
                    it: "C'è un po' di ceci in questo... Di giorno pacata e amichevole e di notte a tratti difficile da controllare. Nelle due sere al Montecristo si sbronza pesantemente da un momento all'altro senza che nessuno capisca come e quando sia successo. Appena sente blinding lights diventa più piccante del spicy cheese avli sauce. Un ringraziamento a jaki per il passaggio (poverino). Ps non prestatele i calzini.",
                    en: "There's a bit of Ceci in this... Calm and friendly by day, and at times hard to control by night. In the two nights at Montecristo, she gets heavily drunk all of a sudden without anyone understanding how or when it happened. As soon as she hears Blinding Lights, she gets spicier than the spicy cheese avli sauce. Thanks to Jack for the ride (poor guy). PS: Don't lend her socks."
                }
            },
            {
                name: "Chiara",
                nick: { it: "BIG ROM", en: "BIG ROM" },
                grade: "8+",
                desc: {
                    it: "Parte con la squadra nonostante un po' di influenza per il precampionato alzando un po' troppo il gomito la sera, dando spettacolo pisciando in mare come mamma l'ha fatta. L'acqua sicuramente non regge il confronto con Milano Marittima però una o due spiagge si sono salvate. Negli ultimi giorni di mercato un trasferimento inaspettato la porta A LLORET DE MAR. Entro, infetto, esco, ciao.",
                    en: "Starts with the team despite some flu for pre-season, raising her elbow a bit too much in the evening, putting on a show by pissing in the sea like God made her. The water definitely doesn't match Milano Marittima, but one or two beaches were saved. In the last days of the transfer window, an unexpected move takes her TO LLORET DE MAR. Enter, infect, exit, bye."
                }
            },
            {
                name: "Bax",
                nick: { it: "IL PENGWIN", en: "THE PENGWIN" },
                grade: "9-",
                desc: {
                    it: "Dopo la buona prestazione dell'anno scorso si riconferma pilota, prova a scaldare le gomme dietro la safety car innescando le ire dei maranza greci. Scommette il patrimonio familiare con girla puntando su Paci. Se non ti sveglia con la musica techno la mattina sicuro chiederà 'chi ha bevuto l'acqua stanotte?'",
                    en: "After last year's good performance, he is confirmed as driver, trying to warm up the tires behind the safety car, triggering the anger of the Greek maranzas. Bets his family wealth with Girla on Paci. If he doesn't wake you up with techno music in the morning, he will surely ask 'who drank the water last night?'"
                }
            },
            {
                name: "Paga",
                nick: { it: "IL BARISTA", en: "THE BARISTA" },
                grade: "9.5",
                desc: {
                    it: "Paga di più i voli perché deve imbarcare il boa in stiva e le ragazze a cui ha preparato il caffè lo sanno bene. Passa ogni alba a cavalcioni sulla terrazza facendo catcalling e quando funziona gli tocca giocare coi tacchetti a 6 nel pantano (meglio non girare il materasso). Vive di rendita dalle pentole pulite il primo giorno. Ci ricorda che: Abbiamo casa a 3 minuti a piedi dal Montecristo.",
                    en: "Paga pays more for flights because he has to check the boa in the cargo hold, and the girls he prepared coffee for know it well. Spends every dawn straddling the terrace catcalling, and when it works he has to play with 6-stud cleats in the mud (better not turn the mattress). Lives off the interest of the pots cleaned on the first day. Reminds us that: We have a house 3 minutes walk from Montecristo."
                }
            },
            {
                name: "Girla",
                nick: { it: "PITA ADVISOR", en: "PITA ADVISOR" },
                grade: "8.5",
                desc: {
                    it: "Gestisce l'economia della casa e della vacanza chiudendo como previsto con il bilancio migliore tra tutti. È MOLTO attento alla pulizia dopo le due settimane di convivenza con letizia ad eccezione del pigiama che lo usa ancora sporco. L'ultima sera regala spettacolo facendo capire ad ari che non è il suo tipo e rischia la rissa quando gli viene chiesto 1€ di mancia. Se volete mangiare una Pita sapete a chi chiedere.",
                    en: "Manages the house and vacation economy, closing as expected with the best balance of all. Very attentive to cleaning after two weeks of cohabitation with Letizia, except for his pajamas which he still uses dirty. The last night he puts on a show making Ari understand she is not his type and risks a fight when asked for 1€ tip. If you want to eat a Pita, you know who to ask."
                }
            },
            {
                name: "Gaia",
                nick: { it: "LA POETESSA", en: "THE POETESS" },
                grade: "9",
                desc: {
                    it: "Grazie a qualche sostanza resiste sorprendentemente fino all'ultima sera dopo il tramonto, visita più grotte di Rocco Siffredi e delizia tutti con una grande massima che tradurremo dal latino nel seguente modo: 'Sei mia e adesso ti infilo il pisello'. PS: No cazzi dopo i pasti.",
                    en: "Thanks to some substances she surprisingly lasts until after sunset on the last night, visits more caves than Rocco Siffredi and delights everyone with a great quote: 'You are mine and now I'll stick it in'. PS: No cazzi after meals."
                }
            },
            {
                name: "Paci",
                nick: { it: "IL PADRINO", en: "THE GODFATHER" },
                grade: "9-",
                desc: {
                    it: "Pronto per l'ennesima estate da single, ma sta volta da solo. Fiero del suo status, ma con ancora qualche strascico. Gli manca sempre la prima marcia, ma non cade nella tentazione dei roiti nucleari. Ultima sera maledetto da un vodoo greco. Mette in stand by la compagnia per una sera, causa: possiamo dire che 'papà è tornato'.",
                    en: "Ready for yet another summer as a single, but this time alone. Proud of his status, but still with some traces. Always lacks first gear, but doesn't fall into the temptation of nuclear roiti. The last night he is cursed by a Greek voodoo. Puts the company on stand-by for a night, cause: we can say that 'daddy is back'."
                }
            }
        ]
    },
    puglia2023: {
        title: { it: "🇮🇹 Puglia 2023", en: "🇮🇹 Apulia 2023" },
        stats: { avg: 8.25, top: "9 (Girla)", participants: 9, duration: "7 giorni", location: "Puglia" },
        reports: [
            {
                name: "Girla",
                nick: { it: "ANTHONY MARTIAL", en: "ANTHONY MARTIAL" },
                grade: "9",
                desc: {
                    it: "Quest'anno viene contraddistinto dalla sua eleganza, dovuta all'utile generato in questo suo 2023, grazie al quale si imborghesisce e non indossa capi al di sotto del millino. Anche quest'anno non si smentisce nella creazione di meme (potrebbe tranquillamente essere l'admin di nonsonobellomaspaccio) però un problem fisico lo costringe ai box più di una volta. Nelle due serate fatte non si iscrive al tabellino dei marcatori per non ritrovarsi nella stessa situazione dell'Ucraina.",
                    en: "This year characterized by his elegance, due to the profit generated in this 2023, thanks to which he becomes boujee and doesn't wear garments under a grand. Also this year he doesn't disappoint in creating memes, but a physical issue forces him to the pits more than once. In the two nights out he doesn't score to avoid finding himself in the same situation as Ukraine."
                }
            },
            {
                name: "Ceci",
                nick: { it: "LA CAFONA", en: "THE TRASHY" },
                grade: "8.5",
                desc: {
                    it: "Partendo dal presupposto che il duomo fa cagare perché ci sono i piccioni fuori, è importante evidenziare la tranquillità e i nervi saldi con cui gestisce la scelta della spiaggia la mattina dell’arrivo ad Alezio city, insistendo molto per andare in questo luogo sconosciuto detto Porto Cesareo. Purtroppo come navigatore non da il meglio di sè ma almeno permette alle girls di risparmiare una notte di affitto a Monopoli, facendole arrivare il giorno dopo con le sue indicazioni.",
                    en: "Starting from the assumption that the cathedral sucks because of the pigeons outside, it's important to highlight the calmness and steel nerves with which she handles the morning choice of beach, insisting to go to this unknown place called Porto Cesareo. Unfortunately as navigator she doesn't give her best but at least lets the girls save a night of rent in Monopoli, making them arrive the next day with her directions."
                }
            },
            {
                name: "Ari",
                nick: { it: "LA BENZINAIA", en: "THE GAS STATION ATTENDANT" },
                grade: "9-",
                desc: {
                    it: "Arriva con il collo marchiato dal Conte Mattia e uccide subito il mood della vacanza utilizzando un terzo del budget della spesa per comprare gli assorbenti; e mentre a lei non è mai arrivato il ciclo i boys si sono visti costretti ad alternare giorni senza dentifricio a giorni senza sapone per le mani. Si sta ancora chiedendo perché il pieno di benzina iniziale non sia stato messo su Splitwise, abbassando ad ogni richiesta il QI medio italiano, ma anche strappando ogni volta una risata a tutto il gruppo e facendo alzare continuamente il suo voto.",
                    en: "Arrives with her neck marked by Count Mattia and immediately kills the mood of the vacation using a third of the grocery budget to buy pads; and while she never got her period, the boys found themselves forced to alternate days without toothpaste to days without hand soap. She is still wondering why the initial full tank of gas was not put on Splitwise, lowering the average Italian IQ at each request, but also cracking a laugh from the group every time and steadily raising her grade."
                }
            },
            {
                name: "Bax",
                nick: { it: "LA ZECCA DI STATO", en: "THE STATE TICK" },
                grade: "8.5",
                desc: {
                    it: "Rinnova per il terzo anno con la scuderia per la felicità dei tifosi. Rimane fregato essendo l’unico ad avere soldi in contanti, sperando che tornino prima della benza di Corfù 2022. I genitori di tutti sono tranquilli perché conoscono ogni nostro spostamento grazie a lui che fa le veci di Pierluigi Pardo con Marta e la Carla. Ogni giorno al Mare porta un ombrellone solo per se stesso causa allergia al sole. Se non giochi al 'grande gioco dei nomi' ti sgozza, stacce.",
                    en: "Renews for the third year with the stable to the fans' joy. Gets screwed being the only one with cash, hoping it returns before the gas money of Corfu 2022. Everyone's parents are quiet because they know our every move thanks to him actting as Pierluigi Pardo with Marta and Carla. Every day at the beach he brings an umbrella only for himself due to sun allergy. If you don't play the 'names game' he cuts your throat, stacce."
                }
            },
            {
                name: "Gaia",
                nick: { it: "DORAEMON", en: "DORAEMON" },
                grade: "8",
                desc: {
                    it: "A differenza delle altre ragazze porta tutto il necessario e si permette il lusso di portarsi la sua colazione personale che nasconde accuratamente dai predatori durante il corso di tutta la vacanza. Piccolo scivolone nel suo ambito, le lavastoviglie: far partire il programma ECO da 4 ore e poi togliere la chiave che tiene accesa la corrente non è stata un’ottima idea. Importante citare anche la sua crisi di mezza età alla Praja.",
                    en: "Unlike the other girls she brings everything necessary and allows herself the luxury of bringing her personal breakfast which she hides carefully from predators during the entire vacation. A small slip in her domain, dishwashers: starting the 4-hour ECO program and then pulling the key that keeps the electricity on wasn't a great idea. Important to mention her midlife crisis at Praja."
                }
            },
            {
                name: "Chiara",
                nick: { it: "LA PART-TIME", en: "THE PART-TIME" },
                grade: "7.5",
                desc: {
                    it: "Come l’anno scorso viene richiamata dal prestito a metà stagione. Solo una serata no per lei, causa risposta deludente da parte della relatrice della tesi, ma viene distratta dai numerosi rutti dei boys dopo l’ottima pasta al pesto Rana. Voto basso a causa della vittoria sia del premio come miglior outfit delle girls, con il vestito d’oro ad alberobello, sia quello della girl meno scassa cazzo.",
                    en: "Like last year she is recalled from loan mid-season. Only one bad night for her, due to a disappointing response from her thesis advisor, but she is distracted by the numerous burps of the boys after the excellent pesto Rana pasta. Low grade because of winning both the best girls outfit prize, with the golden dress in Alberobello, and the least annoying girl prize."
                }
            },
            {
                name: "Paga",
                nick: { it: "IL MEGAFONO", en: "THE MEGAPHONE" },
                grade: "8",
                desc: {
                    it: "Un po’ sottotono rispetto agli altri anni forse anche grazie al fatto che arriva a pancia piena con un goal poco prima della partenza. La sua giornata tipo è: mi sveglio, mangio, rutto, cago e bestemmio, per poi ripetere questa sequenza fino a cena. Non ha più il fisico di una volta, però si merita mezzo voto in più per l’insalata di riso che è bastata a sfamare tutti gli abitanti di Alezio city.",
                    en: "A bit quiet compared to other years, perhaps because he arrives full with a goal shortly before departure. His typical day is: I wake up, eat, burp, shit, and curse, then repeat this sequence until dinner. He no longer has the physique of the past, but deserves half a grade extra for the rice salad that was enough to feed all the inhabitants of Alezio city."
                }
            },
            {
                name: "Paci",
                nick: { it: "IL BENEFATTORE", en: "THE BENEFACTOR" },
                grade: "8",
                desc: {
                    it: "Dopo il periodo di carcere (non per aver rubato le barrette) a Monopoli, torna insieme ai boys ad Alezio city. La sua specialità è palleggiare e giocare a calcio appena scesi dalla macchina, incurante del terreno di gioco perde qualche pallone di troppo. Dopo una sostanziosa donazione alla fondazione Panigalli, viene ricompensato con un goal al 95'. Mezzo voto in meno per lo stile talmente zanza che Cellery può accompagnare solo; menzione d’onore per gli occhiali di cui si voleva liberare 30 secondi dopo averli comprati.",
                    en: "After his prison period (not for stealing bars) in Monopoli, he returns with the boys to Alezio city. His specialty is juggling and playing soccer as soon as they get out of the car, careless of the terrain he loses a few too many balls. After a substantial donation to the Panigalli foundation, he is rewarded with a goal at 95'. Half a point less for a style so zanza that Cellery can only watch; honorable mention for the glasses he wanted to get rid of 30 seconds after buying them."
                }
            },
            {
                name: "Gio",
                nick: { it: "MIKE TYSON", en: "MIKE TYSON" },
                grade: "8",
                desc: {
                    it: "Abbastanza boy da stare nella macchina dei boys, ma non abbastanza da dormire nella dependance dei boys. Durante la serata alla Praja tenta il KO su un maranza che la stava palpando, ma purtroppo va a vuoto. Quando ne ha più bisogno e non ci sperava più, ecco pronto un contratto multimilionario dall’Al Nassr per duettare in attacco con Cristiano Ronaldo.",
                    en: "Boy enough to be in the boys' car, but not enough to sleep in the boys' outbuilding. During the night at Praja she attempts a KO on a maranza who was groping her, but unfortunately misses. When she needs it most and had lost hope, here comes a multi-million contract from Al Nassr to pair up with Cristiano Ronaldo in attack."
                }
            }
        ]
    },
    croazia2024: {
        title: { it: "🇭🇷 Croazia 2024", en: "🇭🇷 Croatia 2024" },
        stats: { avg: 8.6, top: "9+ (Bax)", participants: 7, duration: "9 giorni", location: "Croazia" },
        reports: [
            {
                name: "Il bimbo",
                nick: { it: "MR DICK", en: "MR DICK" },
                grade: "10-",
                desc: {
                    it: "1,8km (0,9€) di pura follia, all'inizio viene preso con tante speranze, ma poi sostituito subito dai panardi della Lidl, finendo per diventare una mascotte. Inizia a macinare terreno venendo utilizzato come scarpetta per il sugo durante una cena circondati da gatti. Poi ci aiuta con un paio di panini alla nutella marcia durante le colazioni. E quando il suo compito sembrava finito, tanto da venir lanciato e preso a calci, stupisce tutti ed entra a gamba tesa nella penultima cena dei boys, carriandola totalmente dopo essersi fatto 20 minuti nel forno.",
                    en: "1.8km (0.9€) of pure madness, bought initially with high hopes, but immediately replaced by Lidl's bread, ending up as a mascot. Starts gaining ground by being used to wipe the sauce during a dinner surrounded by cats. Then helps us with a couple of rotten Nutella sandwiches during breakfasts. And when his task seemed over, so much that he was thrown and kicked, he surprises everyone and tackles the boys' penult dinner, carrying it totally after spending 20 minutes in the oven."
                }
            },
            {
                name: "Bax",
                nick: { it: "DELUX", en: "DELUX" },
                grade: "9+",
                desc: {
                    it: "Per il quarto anno di fila si riconferma pilota, consuma un po' troppa benzina guidando come un pazzo e una volta, ascoltando Milano Testarossa, tenta la quadkill sui boys andando dritto ad una curva. Le sua giornata tipo è caratterizzata da: 3 ore di macchina con max 5 canzoni diverse, minimo una tappa alla Lidl/Plodine/Mumbaza, max 2 ore in spiaggia, guardare la stellata ogni sera. Il tutto viene sempre riferito a fine giornata a Maria. -0.5 per il doppio passo del drink 'offerto' a paga in disco.",
                    en: "For the fourth year in a row he confirms as driver, consumes a bit too much fuel driving like a maniac and once, listening to Milano Testarossa, attempts a quadkill on the boys going straight at a curve. His typical day is characterized by: 3 hours in the car with max 5 different songs, at least one stop at Lidl/Plodine/Mumbaza, max 2 hours on the beach, watching the stars every night. Everything reported at the end of the day to Maria. -0.5 for the double-cross of the drink 'offered' to Paga in the disco."
                }
            },
            {
                name: "Girla",
                nick: { it: "EHI EWA, HAI PROGRAMMI?", en: "EHI EWA, GOT PLANS?" },
                grade: "9",
                desc: {
                    it: "Freschissimo di laurea ci sono grandi aspettative su di lui, dovute anche ad un aumento di budget dopo i recenti investimenti ben fatti. Illude tutti offrendo la cena a Spalato, ma in 0.0035 secondi finisce su Splitwise, facendo capire che la musica non è cambiata (come in macchina di Bax). In cucina però si esalta caramellando qualsiasi cosa assomigli ad una cipolla e in serata si cucina le 2005 finlandesi diffondendo il 'Lesgoski'. Il suo prime lo vive sicuramente in Bosnia dove grazie al cambio favorevole, vive due giorni in Black Friday. Verso fine vacanza si scopre che il suo grande miglioramento in inglese non è dovuto alle lezioni della Terzi ma a delle call con l'headquarter di Varsavia.",
                    en: "Freshly graduated, there are high expectations on him, also due to a budget increase after recent well-made investments. Fools everyone by offering dinner in Split, but in 0.0035 seconds it ends up on Splitwise, showing that the music hasn't changed (just like in Bax's car). In the kitchen however he shines caramelizing anything that looks like an onion and in the evening he cooks the Finnish 2005s, spreading the 'Lesgoski'. He lives his prime in Bosnia where, thanks to the favorable exchange rate, he lives two days of Black Friday. Towards the end of the trip, it turns out his english improvement isn't from Terzi's lessons but from calls with the Warsaw headquarter."
                }
            },
            {
                name: "Paga",
                nick: { it: "RIGATONI, NO FUSILLI", en: "RIGATONI, NO FUSILLI" },
                grade: "9-",
                desc: {
                    it: "Il re di Brisbane ha sulle spalle la responsabilità di aver prenotato 10 case, ottima quella 'a 3 minuti da Dubrovnik' se non fosse che in mezzo c'è la dogana bosniaca con un'ora di coda ad ogni passaggio. Durante il viaggio itinerante ne organizza un altro per la settimana dopo, un po' per poppare in toscana e un po' per scroccare in Sarda e all'Elba. Prima che la Polo di Chiara partisse gli lascia un bel rigatone sopra, costringendo i boys a 5 giorni di stenti in attesa del preventivo per una portiera nuova. -0,5 per i video home tour alla ciuccia toscana, ma +0,5 per gli shot offerti alle finlandesi per la squadra.",
                    en: "The king of Brisbane has on his shoulders the responsibility of booking 10 houses, excellent the one '3 minutes from Dubrovnik' except that in between there's the Bosnian border with an hour queue at each crossing. During the road trip he organizes another one for the following week, a bit to poppare in Tuscany and a bit to scrounge in Sardinia and Elba. Before Chiara's Polo departed he leaves a nice rigatone on it, forcing the boys to 5 days of hardships waiting for a new door quote. -0.5 for home tour videos of the Tuscan babe, but +0.5 for shots offered to the Finnish girls for the team."
                }
            },
            {
                name: "Paci",
                nick: { it: "COLUI CHE LA SPIEGA", en: "HE WHO EXPLAINS IT" },
                grade: "8.5",
                desc: {
                    it: "Partenza in salita per lui dopo il tentato omicidio da parte di Ari con l'aria condizionata [si si!] che gli ha causato un giorno di stop. In tutta la vacanza non tocca mai i fornelli e nemmeno il cazzo, per fortuna a Monza lo aspettano almeno quattro amiche 2010 della sorella. Durante tutta la vacanza si gasa per le storie di una tipa a Caso, peccato che l'ultimo giorno scoprirà essere la fidanzata di una famosa cantante Milanese. Impossibile non fare acquisti scam ogni vacanza: 7€ di succo a bordo strada e 7€ di Puff in disco.",
                    en: "Uphill start for him after Ari's attempted murder with the air conditioning [yes, yes!] which caused him a day of stop. In the whole vacation he never touches the stove nor any dick, luckily in Monza at least four 2010 friends of his sister are waiting for him. During the whole trip he gets hyped for the stories of a random girl, too bad that on the last day he discovers she's the girlfriend of a famous Milanese singer. Impossible not to make scam purchases every vacation: 7€ juice on the roadside and 7€ Puff in the disco."
                }
            },
            {
                name: "Ari",
                nick: { it: "STANGA?MAGARI", en: "STANGA?I WISH" },
                grade: "8-",
                desc: {
                    it: "C'è un po' di Ari in questo Mattia. Per vendicarsi dei boys che hanno ordinato 10kg di carne in Bosnia gli attacca un bel virus prima di andarsene. Post laghi di Plitvice ha dei polpacci che manco @nicolòcereda01. Le partenze in salita non sono il suo forte ma non ha colpe sui danni causati alla Verpelli's Polo. Tenta l'omicidio su Paci alzando l'aria condizionata, ma purtroppo lo lascia solo oneshot. Nonostante il poco tempo passato al sole è riuscita ad abbronzarsi come Carlo Conti.",
                    en: "There's a bit of Ari in this Mattia. To take revenge on the boys who ordered 10kg of meat in Bosnia, she infects them with a virus before leaving. Post Plitvice lakes she has calves that not even @nicolòcereda01. Uphill starts are not her thing but she has no blame for the damage to Verpelli's Polo. Attempts murder on Paci by raising the air conditioning, but unfortunately only leaves him oneshot. Despite the little time in the sun she managed to tan like Carlo Conti."
                }
            },
            {
                name: "Chiara",
                nick: { it: "AMMAN", en: "AMMAN" },
                grade: "8",
                desc: {
                    it: "Se l'acqua di Corfù era come quella di Milano Marittima, i paesaggi croati invece assomigliano molto alla Giordania (ancora da capire se ci sia andata). Se sali sulla sua macchina sei certo di vedere tutti i patrimoni Unesco ad ogni viaggio. Le sue speranze sono riposte nella cena di pesce dell'ultima sera, dove rimane delusa da un risotto alla milanese. Per il terzo anno di fila viene richiamata dal prestito, ma sta volta si porta dietro anche Ari. -0.5 per il solito part time, + 0.5 per aver messo la macchina.",
                    en: "If the water in Corfu was like Milano Marittima, the Croatian landscapes look a lot like Jordan (still to understand if she went there). If you get in her car you are sure to see all the Unesco heritage sites at each trip. Her hopes are set on the last night fish dinner, where she is disappointed by a Milanese risotto. For the third year in a row she is recalled from loan, but this time she brings Ari along. -0.5 for the usual part time, +0.5 for putting the car."
                }
            }
        ]
    },
    barcellona2024: {
        title: { it: "🇪🇸 Barcellona 24/25", en: "🇪🇸 Barcelona 24/25" },
        stats: { avg: 9.2, top: "10 (Marti/Ari)", participants: 8, duration: "5 giorni", location: "Barcellona" },
        reports: [
            {
                name: "Marti",
                nick: { it: "L'INFLUENCER", en: "THE INFLUENCER" },
                grade: "10",
                desc: {
                    it: "Fresca di firma sul contratto è costretta a stamparsi un sorriso in faccia per non fare brutta figura con gli amici del fidanzato. Un po' provata ancora dal recente cambio di telefono che l'ha costretta a ritrovarsi con l'iphone 16, non nasconde comunque la sue doti da boomer ben visibili ai suoi follower. Prepara la squadra alla serata principale infilando scorte di alcol in tutti gli orifizi dei compagni. L'ultima sera ospita un hamburgerata importante mantendendo la calma sotto la pressione degli chef paga e girla.",
                    en: "Freshly signed she is forced to stamp a smile on her face not to look bad with her boyfriend's friends. A bit tested by the recent phone change that forced her to end up with the iphone 16, she doesn't hide her boomer traits visible to her followers. Prepares the team for the main night stuffing alcohol reserves in all orifices of her comrades. On the last night she hosts an important burger night keeping calm under the pressure of chefs Paga and Girla."
                }
            },
            {
                name: "Paci",
                nick: { it: "LO STOMACO DEBOLE", en: "THE WEAK STOMACH" },
                grade: "9.5",
                desc: {
                    it: "Dopo mesi di organizzazione, tra sistemazione dei letti e cenone di capodanno, il mister Paci affronta il match tra alti e bassi. Parte con un palo in faccia per il coffe chiuso. Si rialza con la serata al Negro potendo tirare un sospiro di sollievo per aver fatto spendere 120€ ai suoi amici. Per lui l'anno non comincia nel migliore dei modi, tra una quasi rissa col papi Bax e una giornata passata tra coperte e vomito, salvato solo dalla sua dottoressa personale. Si riprende con grande stile, carico per poter gestire da un lato le richieste di foto della sua nuova ragazza e dall'altro le cagate dei suoi amici. Nella serata degli hamburger assemblatore di panini e supervisore.",
                    en: "After months of organization, from bed arrangement to the New Year's dinner, mister Paci faces the match with ups and downs. Starts with a post in his face for the closed coffee shop. Gets up with the night at the Negro, breathing a sigh of relief for making his friends spend 120€. For him the year doesn't start in the best way, between a near fight with daddy Bax and a day spent between blankets and vomit, saved only by his personal doctor. Recovers with great style, loaded to manage on one hand the photo requests of his new girl and on the other the cagate of his friends. In the burger night, burger assembler and supervisor."
                }
            },
            {
                name: "Girla",
                nick: { it: "CIPOLLE SUDARE", en: "SWEATING ONIONS" },
                grade: "9.5",
                desc: {
                    it: "Arriva con un zoo intero sulla spalla che però non riesce a soddisfare causa chiusura per feste sfondandosi però con due cope di nada al bar. Gli fa un male cane la testa per l'alcol del giorno prima, ma si riprende alla grande grazie ai medicinali offerti da letizia. Nonostante questa cosa l'abbia destabilizzato un po' la sera di capodanno si diverte e si gode la serata, ma quando scoccano le 3 non c'è n'è per nessuno, si siede al tavolo entrando in mutismo selettivo. L'ultima sera si scontra con martina nella preparazione delle cipolle caramellate ma tutto è bene quel che finisce bene.",
                    en: "Arrives with a whole zoo on his shoulder which however he can't satisfy due to holiday closures, stuffing himself instead with two cups of nothing at the bar. He has a stomach of steel and doesn't even feel the kebab, probably had already taken meds to cure the 120€ loss. Despite this destabilizing him a bit on New Year's Eve he enjoys the night, but when 3 AM hits, there's no one home, he sits at the table entering selective mutism. On the last night he clashes with Martina in preparing caramelized onions but all's well that ends well."
                }
            },
            {
                name: "Bax",
                nick: { it: "PAPÀ V", en: "DADDY V" },
                grade: "9",
                desc: {
                    it: "Il papà del gruppo non si smentisce e arriva il 30 sera con tutti i bambini in gita. Gestisce alla perfezione spese e pasti e il 31 sera non si sbottona godendosi la serata davvero signore senza alzare troppo l'omero, ma rischia l'espulsione nel faccia a faccia con Paci, il tutto fortunatamente si risolve con una stretta di mano (e un abbraccio). Dopo che tutto l'1 prova ad utilizzare uno dei due bagni che erano occupati contemporaneamente da paga, decide di arrendersi e tornare in italia con cecilia per poter finalmente cagare.",
                    en: "The dad of the group doesn't deny himself and arrives on the 30th evening with all the kids on a trip. Manages expenses and meals to perfection and on the 31st evening doesn't unbutton, enjoying the night as a true gentleman without raising his arm too much, but risks expulsion in a face-to-face with Paci, which fortunately resolves with a handshake (and a hug). After all of Jan 1st he tries to use one of the two bathrooms occupied simultaneously by Paga, he decides to surrender and return to Italy with Cecilia to finally take a shit."
                }
            },
            {
                name: "Ceci",
                nick: { it: "LA RADIOLINA", en: "THE RADIO BOX" },
                grade: "9+",
                desc: {
                    it: "Si presenta in inferiorità numerica a dover fronteggiare un'armata di boys pronta a distruggerle l'umore. Dopo la maratona di BARCELLONA effettuata per prendere un caffè con eugi fa ininterrottamente due cose: chiederti di fare una foto e se sei contento che lei sia lì con te e prontamente ogni volta tocca rispondere si. Anche lei con il timore di diventare stitica decide di abbandonare la nave in anticipo e scappa con bax il 2 mattina.",
                    en: "Presents herself outnumbered, facing an army of boys ready to destroy her mood. After the BARCELONA marathon done to grab a coffee with Eugi, she continuously does two things: ask you to take a photo and if you are happy she is there with you, and promptly you have to reply yes. She too, fearing becoming constipated, decides to abandon the ship early and escapes with Bax on the morning of the 2nd."
                }
            },
            {
                name: "Paga",
                nick: { it: "RISO SENZA LATTOSIO", en: "RICE WITHOUT LACTOSE" },
                grade: "9-",
                desc: {
                    it: "Inizia la vacanza in maniera tranquilla lasciandosi trascinare da girla verso il lato oscuro del risparmio ed ecco qui il primo errore, un kebab dalla qualità discutibile mangiato il 30 dicembre alle ore 13.24 lo rende il più grande incubo di ferdi, il quale non riesce più ad usare il bagno nei 3 giorni successivi. A capodanno fa la sua figura, si iscrive al tabellino ma per problemi di organizzazione non riesce a siglare la doppietta. L'ultima sera si improvvisa capo cuoco a casa martina supervisionando la creazione degli hamburger.",
                    en: "Starts the vacation quietly letting himself be dragged by Girla to the dark side of saving and here's the first mistake: a kebab of questionable quality eaten on Dec 30th at 1:24 PM makes him Ferdi's worst nightmare, who can no longer use the bathroom for the next 3 days. On New Year's Eve he makes his mark, scoring but due to organization issues fails to secure the brace. On the last night he acts as head chef at Martina's house supervising the burger creation."
                }
            },
            {
                name: "Ferdi",
                nick: { it: "CAZZO DICI", en: "WHAT THE FUCK ARE YOU SAYING" },
                grade: "9",
                desc: {
                    it: "Dopo aver passato il natale in solitaria viene invaso dall'uragano italiano, ma non si scompone e sembra apprezzare l'arrivo dei monzesi grazie anche al supporto prontamente arrivato dalla bolivia. In casa fa finta di fare qualcosa per nn fare brutta figura con gli ospiti mostrando subito l'italiano imparato in questi mesi: 'Mi mangio la mela mentecatto succhiami il cazzo'. Al Negro rojo non incide, dimenticandosi le chiavi della discordia rischiando di causare una rissa tra coinquilini. L'ultima sera sente la pressione di girla perdendo la lucidità davanti ad un bicchiere per la felicità della proprietaria di casa.",
                    en: "After spending Christmas in solitude he is invaded by the Italian hurricane, but doesn't get upset and seems to appreciate the arrival of the Monzesi thanks to the support from Bolivia. At home he pretends to do something to look good, showing the Italian learned in these months: 'I eat the apple you idiot suck my dick'. At Negro Rojo he doesn't impact, forgetting the keys of discord and risking a fight between flatmates. The last night he feels Girla's pressure losing lucidity in front of a glass to the home owner's joy."
                }
            },
            {
                name: "Ari",
                nick: { it: "IN SMARTWORKING", en: "IN SMARTWORKING" },
                grade: "10",
                desc: {
                    it: "Pagella d'onore nonostante la sua assenza, che però le ha fatto guadagnare punti infiniti come figlia. Fortunatamente per lei si trattava del primo capodanno low-cost non causando rimorsi dal punto di vista economico. Viene comunque aggiornata tramite videochiamata anche se averla dal vivo sarebbe stata tutt'altra cosa ❤.",
                    en: "Honorable report card despite her absence, which earned her infinite points as a daughter. Fortunately for her it was the first low-cost New Year's Eve causing no economic remorse. She is still updated via video call even if having her live would have been something else entirely ❤."
                }
            }
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
        pass_input_placeholder: "Password...",
        profile_select_title: "Chi sei?",
        profile_select_subtitle: "Seleziona il tuo profilo ufficiale per accedere alle tue schede personali.",
        profile_select_guest: "Entra come Ospite",
        nav_home: "Home Pagelle",
        nav_quiz: "Re delle Pagelle",
        nav_jeopardy: "Jeopardy Board",
        nav_voting: "Litighiamo!",
        nav_tripvoting: "Votazioni Fine Vacanza",
        nav_gameslist: "Giochi Online",
        nav_profile: "Profilo Personale",
        nav_admin: "Pannello Admin",
        version: "Versione 2.0.0 (Vite modern)",
        created_by: "Sviluppato con ❤️ da Girla",
        logout_profile: "Esci / Cambia Profilo",
        home_intro: "Benvenuti nell'archivio ufficiale del gruppo AP88. Qui troverete tutte le pagelle delle nostre vacanze e le statistiche storiche dei membri del gruppo.",
        stats_historical_title: "Statistiche Storiche",
        stats_top_voti: "🏆 TOP 10 VOTI",
        stats_presenze: "👥 PRESENZE TOTALI",
        stats_medie: "📊 CLASSIFICA MEDIE",
        stats_chart_title: "📈 EVOLUZIONE STORICA DEI VOTI",
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
        voting_rules_title: "⚠️ REGOLE DEL GIOCO",
        voting_rule_1: "Inserite i nomi di tutti i partecipanti presenti (2-10).",
        voting_rule_2: "A schermo apparirà una frase del tipo 'Chi è il più predisposto a...'.",
        voting_rule_3: "A turno, ciascuno vota in SEGRETO sul dispositivo per un altro partecipante.",
        voting_rule_4: "NON rivelate il vostro voto durante la votazione!",
        voting_rule_5: "Alla fine della tornata, verranno mostrati i grafici e la tabella dei voti totali.",
        voting_start_btn: "INIZIA IL GIOCO ☠️",
        voting_turn_for: "VOTA IN SEGRETO:",
        voting_select_victim: "Seleziona la tua vittima:",
        voting_chart_title: "Risultati di questo Round",
        voting_detail_title: "Dettaglio voti (per litigare meglio)",
        voting_table_voter: "Votante",
        voting_table_voted: "Ha votato",
        voting_next_question: "Prossima Domanda 💥",
        voting_new_party: "Resetta / Nuova Partita 🔄",
        voting_reveal_btn: "Rivela Chi Ha Votato Chi",
        voting_players_count: "Numero di partecipanti (2-10)",
        voting_turn_hint: "(Gli altri giratevi e NON GUARDATE!)",
        voting_round_chart_title: "Risultati di questo Round",
        voting_global_chart_title: "Classifica Globale (Sessione)",
        guest_profile_title: "Sei entrato come Ospite",
        guest_profile_desc: "Accedi selezionando uno dei profili ufficiali AP88 per visualizzare le tue pagelle e le tue statistiche storiche.",
        guest_profile_btn: "Seleziona Profilo",
        prof_trips: "Vacanze con il gruppo",
        prof_avg: "Media Voti Storica",
        prof_max: "Voto Massimo Ricevuto",
        prof_perf: "Migliore Performance",
        prof_history_title: "Storico Personale delle Pagelle",
        girla_pass_title: "🔒 Accesso Area Amministratore",
        girla_pass_subtitle: "Inserisci la password aggiuntiva di Girla per abilitare i superpoteri.",
        girla_pass_error: "Password errata. Riprova.",
        girla_pass_btn: "Sblocca Amministrazione",
        girla_pass_input_placeholder: "Password di Girla...",
        admin_intro: "Benvenuto nell'area di amministrazione. Qui puoi aggiungere nuove vacanze con le relative pagelle. Le vacanze aggiunte si integreranno nello storico del sito.",
        admin_add_title: "Aggiungi Nuova Vacanza",
        admin_custom_list_title: "Vacanze Gestibili",
        admin_export_title: "Esporta per GitHub",
        tripvoting_intro: "Qui potete inserire i presenti ed effettuare a turni sul dispositivo le votazioni segrete per stabilire le pagelle finali.",
        tv_setup_title: "Configura Votazioni",
        tv_setup_subtitle: "Aggiungi tutti i presenti alla vacanza che dovranno votare ed essere votati.",
        tv_add_main_member: "Aggiungi Membro Principale",
        tv_add_btn: "Aggiungi",
        tv_add_custom_member: "Oppure aggiungi una persona extra",
        tv_custom_name_placeholder: "Es: Pippo",
        tv_participants_present: "Partecipanti Presenti:",
        tv_start_btn: "Inizia Turni di Voto 🏁",
        tv_turn_voter: "Turno di voto per:",
        tv_turn_warning: "(Tutti gli altri partecipanti devono girarsi e NON guardare lo schermo!)",
        tv_form_title: "Votazione Segreta di:",
        tv_go_vote_btn: "Inizia a Votare 🔒",
        tv_form_subtitle: "Dai un voto da 1 a 10 ed esprimi la tua opinione su ciascuno degli altri presenti.",
        tv_submit_votes_btn: "Conferma e Salva Voti Segreti",
        tv_results_completed_title: "🎉 Votazioni Completate!",
        tv_download_report_btn: "Scarica Report Voti (.txt)",
        tv_results_summary_title: "Riepilogo Voti Medi Ricevuti",
        tv_table_member: "Membro Presente",
        tv_table_average: "Voto Medio Ricevuto",
        tv_table_count: "Numero di Voti Ricevuti",
        tv_results_comments_title: "Tutti i Commenti e Opinioni Raccolte",
        tv_restart_btn: "Nuova Sessione Voti 🔄",
        tv_results_disclaimer: "Questi voti servono a fare le pagelle, per dare spunti, ma che della vostra opinione non ci interessa e saranno come sempre gestite dai poteri forti.",
        tv_results_disclaimer_setup: "Questi voti servono a fare le pagelle, per dare spunti, ma che della vostra opinione non ci interessa e saranno come sempre gestite dai poteri forti.",
        gameslist_intro: "Seleziona uno dei giochi online per iniziare a giocare con il gruppo.",
        admin_trip_name_label: "Nome Vacanza",
        admin_trip_name_placeholder: "Es: Capodanno 2026/27",
        admin_trip_location_label: "Luogo / Destinazione",
        admin_trip_location_placeholder: "Es: Mezzenile, Italia",
        admin_trip_duration_label: "Durata",
        admin_trip_duration_placeholder: "Es: 4 giorni",
        admin_member_section_title: "Aggiungi/Modifica Pagella Membro",
        admin_member_select_label: "Seleziona Membro",
        admin_custom_member_name_label: "Nome Membro Personalizzato",
        admin_custom_member_name_placeholder: "Es: Pippo",
        admin_member_nick_label: "Soprannome per questa vacanza",
        admin_member_nick_placeholder: "Es: IL DJ",
        admin_member_grade_label: "Voto",
        admin_member_desc_label: "Descrizione della Pagella",
        admin_member_desc_placeholder: "Scrivi la pagella del membro...",
        admin_add_report_btn: "Aggiungi Pagella a questa Vacanza",
        admin_added_reports_title: "Pagelle Pre-compilate per questa Vacanza",
        admin_save_trip_btn: "Salva e Aggiorna Vacanza 💾",
        admin_custom_list_subtitle: "Le vacanze storiche permanenti non possono essere rimosse. Quelle create da te possono essere rimosse o modificate qui.",
        admin_export_subtitle: "Per rendere definitive le nuove vacanze nel codice sorgente online, copia il JSON sottostante e incollalo nella chat dell'assistente."
    },
    en: {
        pass_title: "🔒 AP88 Restricted Access",
        pass_subtitle: "Enter the general password to unlock the private archive.",
        pass_error: "Wrong password. Try again.",
        pass_hint_title: "Hint:",
        pass_hint_desc: "Nickname of whoever got the highest grade in the Sardinia trip reports (First & Last Name).",
        pass_input_placeholder: "Password...",
        profile_select_title: "Who are you?",
        profile_select_subtitle: "Select your official profile to access your personal stats.",
        profile_select_guest: "Enter as Guest",
        nav_home: "Trip Grades",
        nav_quiz: "Grades Quiz",
        nav_jeopardy: "Jeopardy Board",
        nav_voting: "Let's Fight!",
        nav_tripvoting: "End Trip Voting",
        nav_gameslist: "Online Games",
        nav_profile: "Personal Profile",
        nav_admin: "Admin Panel",
        version: "Version 2.0.0 (Vite modern)",
        created_by: "Developed with ❤️ by Girla",
        logout_profile: "Logout / Change Profile",
        home_intro: "Welcome to the official archive of the AP88 group. Here you will find all the trip reports and historical statistics of the members.",
        stats_historical_title: "Historical Statistics",
        stats_top_voti: "🏆 TOP 10 GRADES",
        stats_presenze: "👥 TOTAL PARTICIPATION",
        stats_medie: "📊 AVERAGE GRADES",
        stats_chart_title: "📈 HISTORICAL GRADES EVOLUTION",
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
        voting_rules_title: "⚠️ GAME RULES",
        voting_rule_1: "Enter the names of all participants present (2-10).",
        voting_rule_2: "A savage question will appear like 'Who is most likely to...'.",
        voting_rule_3: "One by one, vote in SECRET for another participant on the device.",
        voting_rule_4: "DO NOT reveal your vote during the voting process!",
        voting_rule_5: "At the end of the round, voting charts and detail logs will be revealed.",
        voting_start_btn: "START THE GAME ☠️",
        voting_turn_for: "VOTE IN SECRET:",
        voting_select_victim: "Select your victim:",
        voting_chart_title: "Results of this Round",
        voting_detail_title: "Detailed Vote Table",
        voting_table_voter: "Voter",
        voting_table_voted: "Voted for",
        voting_next_question: "Next Question 💥",
        voting_new_party: "Reset / New Game 🔄",
        voting_reveal_btn: "Reveal Who Voted Who",
        voting_players_count: "Number of participants (2-10)",
        voting_turn_hint: "(Everyone else turn away and DO NOT LOOK!)",
        voting_round_chart_title: "Results of this Round",
        voting_global_chart_title: "Global Leaderboard (Session)",
        guest_profile_title: "Logged in as Guest",
        guest_profile_desc: "Log in by choosing one of the official AP88 profiles to view your report card summaries and historical statistics.",
        guest_profile_btn: "Select Profile",
        prof_trips: "Trips with the group",
        prof_avg: "Historical Average",
        prof_max: "Highest Grade Received",
        prof_perf: "Best Performance",
        prof_history_title: "Personal Report Cards History",
        girla_pass_title: "🔒 Admin Area Access",
        girla_pass_subtitle: "Enter Girla's secondary password to enable super administrative powers.",
        girla_pass_error: "Wrong password. Try again.",
        girla_pass_btn: "Unlock Admin Panel",
        girla_pass_input_placeholder: "Girla's Password...",
        admin_intro: "Welcome to the administration panel. Here you can add new vacations with their respective report cards. They will automatically merge with the database.",
        admin_add_title: "Add New Vacation",
        admin_custom_list_title: "Manageable Vacations",
        admin_export_title: "Export for GitHub",
        tripvoting_intro: "Here you can enter the participants and run sequential secret voting to prepare final grades suggestions.",
        tv_setup_title: "Configure Voting",
        tv_setup_subtitle: "Add all vacation participants who will vote and be voted.",
        tv_add_main_member: "Add Main Member",
        tv_add_btn: "Add",
        tv_add_custom_member: "Or add an extra person",
        tv_custom_name_placeholder: "E.g. Pippo",
        tv_participants_present: "Participants Present:",
        tv_start_btn: "Start Voting Turns 🏁",
        tv_turn_voter: "Turn to vote for:",
        tv_turn_warning: "(Everyone else must turn away and NOT look at the screen!)",
        tv_form_title: "Secret Vote of:",
        tv_go_vote_btn: "Start Voting 🔒",
        tv_form_subtitle: "Give a grade from 1 to 10 and express your opinion on each of the other participants.",
        tv_submit_votes_btn: "Confirm and Save Secret Votes",
        tv_results_completed_title: "🎉 Voting Completed!",
        tv_download_report_btn: "Download Votes Report (.txt)",
        tv_results_summary_title: "Summary of Average Grades Received",
        tv_table_member: "Present Member",
        tv_table_average: "Average Grade Received",
        tv_table_count: "Number of Grades Received",
        tv_results_comments_title: "All Comments and Opinions Collected",
        tv_restart_btn: "New Voting Session 🔄",
        tv_results_disclaimer: "These votes serve only as suggestions and inspiration. We don't care about your opinion; final grades will still be managed by the authorities.",
        tv_results_disclaimer_setup: "These votes serve only as suggestions and inspiration. We don't care about your opinion; final grades will still be managed by the authorities.",
        gameslist_intro: "Select one of the online games to start playing with the group.",
        admin_trip_name_label: "Vacation Name",
        admin_trip_name_placeholder: "E.g. New Year 2026/27",
        admin_trip_location_label: "Location / Destination",
        admin_trip_location_placeholder: "E.g. Mezzenile, Italy",
        admin_trip_duration_label: "Duration",
        admin_trip_duration_placeholder: "E.g. 4 days",
        admin_member_section_title: "Add/Edit Member Report Card",
        admin_member_select_label: "Select Member",
        admin_custom_member_name_label: "Custom Member Name",
        admin_custom_member_name_placeholder: "E.g. Pippo",
        admin_member_nick_label: "Nickname for this vacation",
        admin_member_nick_placeholder: "E.g. THE DJ",
        admin_member_grade_label: "Grade",
        admin_member_desc_label: "Report Card Description",
        admin_member_desc_placeholder: "Write the member's report card...",
        admin_add_report_btn: "Add Report Card to this Vacation",
        admin_added_reports_title: "Pre-compiled Report Cards for this Vacation",
        admin_save_trip_btn: "Save and Update Vacation 💾",
        admin_custom_list_subtitle: "Permanent historical vacations cannot be removed. Those created by you can be removed or modified here.",
        admin_export_subtitle: "To make new vacations permanent in the online source code, copy the JSON below and paste it in the assistant chat."
    }
};

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
    "0_0": { category: { it: "Generale", en: "General" }, value: 100, question: { it: "Quando è nato Girla?", en: "When was Girla born?" }, answer: { it: "23 Marzo 2001", en: "March 23, 2001" } },
    "0_1": { category: { it: "Generale", en: "General" }, value: 200, question: { it: "Come si chiamava il suo coniglio?", en: "What was his rabbit's name?" }, answer: { it: "Willy", en: "Willy" } },
    "0_2": { category: { it: "Generale", en: "General" }, value: 300, question: { it: "In che squadra giocava il bisnonno materno di Girla?", en: "Which team did Girla's maternal great-grandfather play for?" }, answer: { it: "Milan (+ Cagliari, GC Vigevanesi, Sempre Avanti)", en: "Milan (+ Cagliari, GC Vigevanesi, Sempre Avanti)" } },
    "0_3": { category: { it: "Generale", en: "General" }, value: 400, question: { it: "Quando (mese e anno) Girla si è fatto la pelata (margine di errore 3 mesi)?", en: "When (month and year) did Girla shave his head (margin of error 3 months)?" }, answer: { it: "Maggio 2022", en: "May 2022" } },
    "0_4": { category: { it: "Generale", en: "General" }, value: 500, question: { it: "Chi, quando e perché ha iniziato a chiamarlo 'Girla'?", en: "Who, when, and why did they start calling him 'Girla'?" }, answer: { it: "Allenatore di calcio, elementari, per non confonderlo con Luca Cesari", en: "Soccer coach, elementary school, to avoid confusing him with Luca Cesari" } },
    
    "1_0": { category: { it: "Amore", en: "Love" }, value: 100, question: { it: "Girla preferisce more o bionde? Occhi chiari o occhi scuri?", en: "Does Girla prefer brunettes or blondes? Light eyes or dark eyes?" }, answer: { it: "More - occhi chiari (anche prima di incontrare Ewa!)", en: "Brunettes - light eyes (even before meeting Ewa!)" } },
    "1_1": { category: { it: "Amore", en: "Love" }, value: 200, question: { it: "Quante tipe si è fatto Girla in discoteca?", en: "How many girls has Girla hooked up with in a club?" }, answer: { it: "0", en: "0" } },
    "1_2": { category: { it: "Amore", en: "Love" }, value: 300, question: { it: "Quante relazioni ufficiali (no elementari) ha avuto e come si chiamavano le ragazze?", en: "How many official relationships (excluding elementary school) has he had and what were their names?" }, answer: { it: "3: Chiara (non Verpelli), Letizia ed Ewa", en: "3: Chiara (not Verpelli), Letizia and Ewa" } },
    "1_3": { category: { it: "Amore", en: "Love" }, value: 400, question: { it: "Dimmi il nome/soprannome delle TRE 'situationship' (no relazioni) avute da Girla", en: "Name the THREE situationships (non-relationships) Girla has had" }, answer: { it: "Maria Luisa Montale (Lully), Alessia (la russa) e Lucia", en: "Maria Luisa Montale (Lully), Alessia (the Russian) and Lucia" } },
    "1_4": { category: { it: "Amore", en: "Love" }, value: 500, question: { it: "Dopo varie relazioni/situationship, quale caratteristica sembra presentarsi maggiormente nelle ragazze trovate?", en: "After various relationships/situationships, what characteristic seems to occur most in the girls he meets?" }, answer: { it: "Daddy Issues (problemi con il padre) :)", en: "Daddy Issues (father issues) :)" } },
    
    "2_0": { category: { it: "Scuola", en: "School" }, value: 100, question: { it: "Cosa è andato a studiare Girla a Londra?", en: "What did Girla go to study in London?" }, answer: { it: "Quantitative Finance (with Data Science)", en: "Quantitative Finance (with Data Science)" } },
    "2_1": { category: { it: "Scuola", en: "School" }, value: 200, question: { it: "Voto di laurea triennale di Girla (margine di errore: 2 punti)?", en: "Girla's bachelor's degree grade (margin of error: 2 points)?" }, answer: { it: "96", en: "96" } },
    "2_2": { category: { it: "Scuola", en: "School" }, value: 300, question: { it: "Quanti debiti scolastici ha preso al liceo Girla?", en: "How many failed subjects (debiti) did Girla get in high school?" }, answer: { it: "8 debiti", en: "8 subjects" } },
    "2_3": { category: { it: "Scuola", en: "School" }, value: 400, question: { it: "Voto di maturità di Girla (margine di errore: 1 point)?", en: "Girla's high school graduation score (margin of error: 1 point)?" }, answer: { it: "64", en: "64" } },
    "2_4": { category: { it: "Scuola", en: "School" }, value: 500, question: { it: "Quante internship ha fatto in triennale e in quante associazioni universitarie è stato in magistrale?", en: "How many internships did he do during his bachelor's, and how many university associations was he in during his master's?" }, answer: { it: "2 internship (Fineco, Invesco) e 2 associazioni (Starting Finance, Miura)", en: "2 internships (Fineco, Invesco) and 2 associations (Starting Finance, Miura)" } },
    
    "3_0": { category: { it: "Viaggi", en: "Travel" }, value: 100, question: { it: "Qual è il viaggio dei sogni di Girla?", en: "What is Girla's dream trip?" }, answer: { it: "Giappone", en: "Japan" } },
    "3_1": { category: { it: "Viaggi", en: "Travel" }, value: 200, question: { it: "In quali due località di mare italiane Girla è sempre andato in vacanza fin da piccolo?", en: "Which two Italian seaside resorts has Girla always gone to on vacation since childhood?" }, answer: { it: "Alassio e Grottammare/San Benedetto del Tronto", en: "Alassio and Grottammare/San Benedetto del Tronto" } },
    "3_2": { category: { it: "Viaggi", en: "Travel" }, value: 300, question: { it: "Prima vacanza di Girla con il gruppo AP88 (luogo, anno, occasione)?", en: "Girla's first vacation with the AP88 group (location, year, occasion)?" }, answer: { it: "Capodanno Roma 2019", en: "New Year Rome 2019" } },
    "3_3": { category: { it: "Viaggi", en: "Travel" }, value: 400, question: { it: "Quali di queste città Girla NON ha mai visitato: Madrid, Parigi, Monaco, Vienna, Varsavia?", en: "Which of these cities has Girla NEVER visited: Madrid, Paris, Munich, Vienna, Warsaw?" }, answer: { it: "Madrid e Parigi", en: "Madrid and Paris" } },
    "3_4": { category: { it: "Viaggi", en: "Travel" }, value: 500, question: { it: "Da quale regione italiana ha origine il cognome Girlando?", en: "Which Italian region does the surname Girlando originate from?" }, answer: { it: "Sicilia", en: "Sicily" } },
    
    "4_0": { category: { it: "Cibo", en: "Food" }, value: 100, question: { it: "Qual è la pizza preferita di Girla?", en: "What is Girla's favorite pizza?" }, answer: { it: "Diavola", en: "Diavola" } },
    "4_1": { category: { it: "Cibo", en: "Food" }, value: 200, question: { it: "Qual è il drink preferito di Girla? Preferisce vino rosso o vino bianco?", en: "What is Girla's favorite drink? Does he prefer red or white wine?" }, answer: { it: "Moscow Mule - Vino Rosso", en: "Moscow Mule - Red Wine" } },
    "4_2": { category: { it: "Cibo", en: "Food" }, value: 300, question: { it: "Cioccolato: bianco, al latte o fondente? Formaggio sulla pasta al sugo di pesce: sì o no?", en: "Chocolate: white, milk or dark? Cheese on pasta with fish sauce: yes or no?" }, answer: { it: "Fondente - Assolutamente no formaggio sul pesce!", en: "Dark - Absolutely no cheese on fish!" } },
    "4_3": { category: { it: "Cibo", en: "Food" }, value: 400, question: { it: "Gin o Vodka? Lemon o Tonic? Tè alla Pesca o al Limone? Gorgonzola o Pecorino?", en: "Gin or Vodka? Lemon or Tonic? Peach or Lemon Tea? Gorgonzola or Pecorino?" }, answer: { it: "Gin, Tonic, Tè alla Pesca, Gorgonzola", en: "Gin, Tonic, Peach Tea, Gorgonzola" } },
    "4_4": { category: { it: "Cibo", en: "Food" }, value: 500, question: { it: "Carne o pesce? Dolce o salato? Carbonara o cacio e pepe? Tette o culo? Prima il latte o prima i cereali?", en: "Meat or fish? Sweet or savory? Carbonara or cacio e pepe? Boobs or butt? Milk first or cereal first?" }, answer: { it: "Pesce, salato, cacio e pepe, culo, prima i cereali", en: "Fish, savory, cacio e pepe, butt, cereal first" } }
};

// --- VOTING QUESTIONS ("LITIGHIAMO") ---
const VOTING_QUESTIONS = [
    { it: "Chi è il più predisposto a tradire il partner durante un viaggio?", en: "Who is most likely to cheat on their partner during a trip?" },
    { it: "Chi è il più predisposto a fare sesso in un luogo pubblico?", en: "Who is most likely to have sex in a public place?" },
    { it: "Chi è il più predisposto a provare un ménage à trois?", en: "Who is most likely to try a threesome?" },
    { it: "Chi è il più predisposto a farsi trovare nudo in una situazione imbarazzante?", en: "Who is most likely to be found naked in an embarrassing situation?" },
    { it: "Chi è il più predisposto a fare Onlyfans?", en: "Who is most likely to start an OnlyFans?" },
    { it: "Chi è il più predisposto a mandare un nudo per sbaglio nel gruppo?", en: "Who is most likely to accidentally send a nude in the group chat?" },
    { it: "Chi è il più predisposto a farsi arrestare all'estero per qualcosa di stupido?", en: "Who is most likely to get arrested abroad for something stupid?" },
    { it: "Chi è il più predisposto a fare una figura di merda epica al primo appuntamento?", en: "Who is most likely to make an epic fool of themselves on a first date?" },
    { it: "Chi è il più predisposto a vomitare dopo appena due drink?", en: "Who is most likely to throw up after just two drinks?" },
    { it: "Chi è il più predisposto a farsi scoprire con una sbronza molesta dai genitori?", en: "Who is most likely to get caught completely hammered by their parents?" },
    { it: "Chi è il più predisposto a finire in prigione per evasione fiscale?", en: "Who is most likely to end up in jail for tax evasion?" },
    { it: "Chi è il più predisposto a rubare asciugamani e accappatoi dagli hotel?", en: "Who is most likely to steal towels and bathrobes from hotels?" },
    { it: "Chi è il più predisposto a corrompere un poliziotto locale?", en: "Who is most likely to bribe a local police officer?" },
    { it: "Chi è il più predisposto a tornare con un ex tossico rovinando tutto?", en: "Who is most likely to get back with a toxic ex, ruining everything?" },
    { it: "Chi è il più predisposto a scrivere un papiro imbarazzante all'ex alle 4 del mattino da ubriaco?", en: "Who is most likely to drunk text a long embarrassing essay to their ex at 4 AM?" },
    { it: "Chi è il più predisposto a farsi truffare da un finto profilo online (catfishing)?", en: "Who is most likely to get catfished by a fake profile online?" },
    { it: "Chi è il più predisposto a ghostare una persona fidanzata senza motivo?", en: "Who is most likely to ghost a fiancé for no reason?" },
    { it: "Chi è il più predisposto a investire tutti i risparmi in criptovalute scam e perdere tutto?", en: "Who is most likely to invest all their savings in a scam cryptocurrency and lose it all?" },
    { it: "Chi è il più predisposto a credere ciecamente alla Terra Piatta o agli UFO?", en: "Who is most likely to believe blindly in Flat Earth or UFOs?" },
    { it: "Chi è il più predisposto a entrare a far parte di una setta esoterica?", en: "Who is most likely to join an esoteric cult?" },
    { it: "Chi è il più predisposto a presentarsi già visibilmente ubriaco a un matrimonio formale?", en: "Who is most likely to show up visibly drunk to a formal wedding?" },
    { it: "Chi è il più predisposto a rovinare un gioco di società litigando selvaggiamente?", en: "Who is most likely to ruin a board game by arguing savagely?" },
    { it: "Chi è il più predisposto a farsi licenziare per un post cringe su Instagram?", en: "Who is most likely to get fired over a cringe post on Instagram?" },
    { it: "Chi è il più predisposto a fare sesso con il capo per fare carriera?", en: "Who is most likely to have sex with the boss for a promotion?" },
    { it: "Chi è il più predisposto a non farsi la doccia per un'intera vacanza estiva?", en: "Who is most likely to not shower for an entire summer vacation?" },
    { it: "Chi è il più predisposto a fare la pipì nella piscina dell'hotel?", en: "Who is most likely to pee in the hotel pool?" },
    { it: "Chi è il più predisposto a scoreggiare sotto le lenzuola e chiudere dentro il partner?", en: "Who is most likely to fart under the sheets and trap their partner?" },
    { it: "Chi è il più predisposto a diventare un influencer cringe su TikTok a 40 anni?", en: "Who is most likely to become a cringe TikTok influencer at age 40?" },
    { it: "Chi è il più predisposto a sposarsi a Las Vegas dopo mezza serata di alcol?", en: "Who is most likely to get married in Las Vegas after a drunken night?" },
    { it: "Chi è il più predisposto a dimenticare il passaporto a casa prima di un volo transatlantico?", en: "Who is most likely to forget their passport at home before a transatlantic flight?" }
];


// ==========================================================================
// CORE APP ROUTER & VIEWS CONTROLLER
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
    lucide.createIcons();
    initThemeAndLanguage();
    initAuthFlows();
    initRouting();
    loadCustomTrips(); // Load vacations created by Girla from LocalStorage
    initTripTabs();
    initGames();
    initAdminPanel();
    initTripVoting();
    renderActiveView();
});

// Load custom vacations from LocalStorage
function loadCustomTrips() {
    const customTrips = JSON.parse(localStorage.getItem("ap88_custom_trips")) || [];
    customTrips.forEach(trip => {
        TRIP_DATA[trip.key] = trip;
    });
}

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
        
        // Re-render evolution chart to adapt grid colors
        if (APP_STATE.activeView === 'home') {
            renderEvolutionChart();
        }
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
            } else if (el.tagName === "TEXTAREA" && el.hasAttribute("placeholder")) {
                el.setAttribute("placeholder", dict[key]);
            } else {
                el.innerText = dict[key];
            }
        }
    });

    // Dynamically update team name inputs if they contain default values
    const quizTeam1 = document.getElementById("quiz-team1-name");
    const quizTeam2 = document.getElementById("quiz-team2-name");
    if (quizTeam1 && (quizTeam1.value === "Squadra 1" || quizTeam1.value === "Team 1")) {
        quizTeam1.value = APP_STATE.language === 'it' ? "Squadra 1" : "Team 1";
    }
    if (quizTeam2 && (quizTeam2.value === "Squadra 2" || quizTeam2.value === "Team 2")) {
        quizTeam2.value = APP_STATE.language === 'it' ? "Squadra 2" : "Team 2";
    }

    lucide.createIcons();
}

// Authentication Flows (Unlocking app & Profile selection)
function initAuthFlows() {
    const passwordOverlay = document.getElementById("password-overlay");
    const profileOverlay = document.getElementById("profile-overlay");
    const appContainer = document.getElementById("app-container");
    
    const isUnlocked = localStorage.getItem("ap88_unlocked") === "true";
    const selectedProfile = localStorage.getItem("ap88_profile");
    const adminUnlocked = localStorage.getItem("ap88_admin_unlocked") === "true";
    
    if (isUnlocked) {
        APP_STATE.unlocked = true;
        passwordOverlay.classList.remove("active");
        
        // Always force profile selection on startup, forget previous session profile
        localStorage.removeItem("ap88_profile");
        localStorage.removeItem("ap88_admin_unlocked");
        showProfileSelection();
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
        
        const info = MEMBER_INFO[member];
        const nicks = info ? info.nicknames : [];
        const nicksHtml = nicks.map(n => `<span class="overlay-nick-tag">${n}</span>`).join("");
        
        card.innerHTML = `
            <div class="profile-img-wrapper">
                <img src="${member}.jpg" alt="${member}" onerror="this.src='https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80'">
                <div class="profile-nicks-overlay">
                    ${nicksHtml}
                </div>
            </div>
            <span>${member}</span>
        `;
        card.addEventListener("click", () => handleProfileSelectionClick(member));
        gridContainer.appendChild(card);
    });

    const guestBtn = document.getElementById("guest-enter-btn");
    guestBtn.addEventListener("click", () => selectProfile("Guest"));

    // Sidebar change profile button
    document.getElementById("change-profile-btn").addEventListener("click", () => {
        localStorage.removeItem("ap88_profile");
        localStorage.removeItem("ap88_admin_unlocked");
        APP_STATE.profile = null;
        APP_STATE.adminUnlocked = false;
        document.getElementById("nav-admin-link").classList.add("hidden");
        appContainer.classList.add("hidden");
        showProfileSelection();
    });

    // Guest card profiles selection button
    document.getElementById("guest-profile-select-btn").addEventListener("click", () => {
        localStorage.removeItem("ap88_profile");
        localStorage.removeItem("ap88_admin_unlocked");
        APP_STATE.profile = null;
        APP_STATE.adminUnlocked = false;
        document.getElementById("nav-admin-link").classList.add("hidden");
        appContainer.classList.add("hidden");
        showProfileSelection();
    });

    // Girla Admin Password prompt bindings
    const girlaModal = document.getElementById("girla-password-modal");
    const girlaPwInput = document.getElementById("girla-password-input");
    const girlaPwSubmit = document.getElementById("girla-password-submit-btn");
    const girlaPwError = document.getElementById("girla-password-error");
    const girlaModalClose = document.getElementById("girla-modal-close");

    girlaModalClose.addEventListener("click", () => {
        girlaModal.classList.add("hidden");
    });

    const attemptGirlaUnlock = () => {
        const val = girlaPwInput.value.trim();
        if (val === "233") {
            APP_STATE.adminUnlocked = true;
            localStorage.setItem("ap88_admin_unlocked", "true");
            girlaModal.classList.add("hidden");
            girlaPwError.classList.add("hidden");
            selectProfile("Girla");
        } else {
            girlaPwError.classList.remove("hidden");
            girlaPwInput.classList.add("shake");
            setTimeout(() => girlaPwInput.classList.remove("shake"), 500);
        }
    };

    girlaPwSubmit.addEventListener("click", attemptGirlaUnlock);
    girlaPwInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") attemptGirlaUnlock();
    });
}

function handleProfileSelectionClick(member) {
    if (member === "Girla") {
        const adminUnlocked = localStorage.getItem("ap88_admin_unlocked") === "true";
        if (adminUnlocked) {
            APP_STATE.adminUnlocked = true;
            selectProfile("Girla");
        } else {
            // Prompt for Girla admin password
            document.getElementById("girla-password-input").value = "";
            document.getElementById("girla-password-error").classList.add("hidden");
            document.getElementById("girla-password-modal").classList.remove("hidden");
        }
    } else {
        selectProfile(member);
    }
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
    
    if (profileName === "Girla" && APP_STATE.adminUnlocked) {
        document.getElementById("nav-admin-link").classList.remove("hidden");
    } else {
        document.getElementById("nav-admin-link").classList.add("hidden");
    }

    updateUIForCurrentUser();
    renderActiveView();

    // Automatically show mobile navigation drawer once user enters
    if (window.innerWidth <= 991) {
        document.getElementById("app-sidebar").classList.add("active");
    }
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

function initRouting() {
    const menuToggle = document.getElementById("sidebar-toggle-mobile-btn");
    const menuClose = document.getElementById("sidebar-close-mobile-btn");
    const sidebar = document.getElementById("app-sidebar");

    menuToggle.addEventListener("click", () => {
        sidebar.classList.add("active");
        document.body.classList.add("sidebar-open");
    });
    menuClose.addEventListener("click", () => {
        sidebar.classList.remove("active");
        document.body.classList.remove("sidebar-open");
    });

    // Close sidebar on tap outside on mobile
    document.addEventListener("click", (e) => {
        if (sidebar.classList.contains("active")) {
            if (!sidebar.contains(e.target) && !menuToggle.contains(e.target) && !menuToggle.querySelector('i')?.contains(e.target)) {
                sidebar.classList.remove("active");
                document.body.classList.remove("sidebar-open");
            }
        }
    });

    const navItems = document.querySelectorAll(".nav-item");
    navItems.forEach(item => {
        item.addEventListener("click", (e) => {
            e.preventDefault();
            const view = item.getAttribute("data-view");
            navigateTo(view);
            sidebar.classList.remove("active");
            document.body.classList.remove("sidebar-open");
        });
    });

    const hash = window.location.hash.replace("#", "");
    const allowed = ["home", "quiz", "jeopardy", "voting", "tripvoting", "gameslist", "profile", "admin"];
    if (hash && allowed.includes(hash)) {
        navigateTo(hash);
    } else {
        navigateTo("home");
    }
}

function navigateTo(viewName) {
    if (viewName === 'admin' && (!APP_STATE.adminUnlocked || APP_STATE.profile !== 'Girla')) {
        viewName = 'home';
    }

    APP_STATE.activeView = viewName;
    window.location.hash = viewName;

    document.querySelectorAll(".nav-item").forEach(item => {
        if (item.getAttribute("data-view") === viewName) {
            item.classList.add("active");
        } else {
            item.classList.remove("active");
        }
    });

    document.querySelectorAll(".view-section").forEach(sec => {
        if (sec.id === `view-${viewName}`) {
            sec.classList.add("active");
        } else {
            sec.classList.remove("active");
        }
    });

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
            buildTripTabsUI();
            renderTripContent();
            renderHistoricalStats();
            renderEvolutionChart();
            break;
        case "profile":
            renderProfilePage();
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
        case "tripvoting":
            renderTripVoting();
            break;
        case "gameslist":
            // Managed directly in HTML, no injection needed
            break;
        case "admin":
            renderAdminPanel();
            break;
    }
    lucide.createIcons();
}


// ==========================================================================
// HOME VIEW: TRIP REPORT CARDS & HISTORICAL EVOLUTION CHART
// ==========================================================================

let evolutionChartInstance = null;

function buildTripTabsUI() {
    const tabsContainer = document.getElementById("trip-tabs");
    tabsContainer.innerHTML = "";
    
    Object.entries(TRIP_DATA).forEach(([key, trip]) => {
        const btn = document.createElement("button");
        const isActive = APP_STATE.activeTrip === key;
        btn.className = `tab-btn ${isActive ? 'active' : ''}`;
        btn.setAttribute("data-trip", key);
        
        const titleText = (typeof trip.title === 'object') ? trip.title[APP_STATE.language] : trip.title;
        btn.innerText = titleText;
        
        btn.addEventListener("click", () => {
            document.querySelectorAll("#trip-tabs .tab-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            APP_STATE.activeTrip = key;
            renderTripContent();
        });
        
        tabsContainer.appendChild(btn);
    });
}

function initTripTabs() {
    // Dynamically managed
}

function renderTripContent() {
    const container = document.getElementById("trip-content");
    const trip = TRIP_DATA[APP_STATE.activeTrip];
    if (!trip) {
        const firstKey = Object.keys(TRIP_DATA)[0];
        if (firstKey) {
            APP_STATE.activeTrip = firstKey;
            renderTripContent();
        }
        return;
    }

    const labels = {
        avg: APP_STATE.language === 'it' ? 'Voto Medio' : 'Average Grade',
        top: APP_STATE.language === 'it' ? 'Top Voto' : 'Top Grade',
        part: APP_STATE.language === 'it' ? 'Partecipanti' : 'Participants',
        loc: APP_STATE.language === 'it' ? 'Luogo' : 'Location'
    };

    let html = `
        <div class="trip-summary-box animate-fade-in">
            <div class="trip-metric-card">
                <div class="trip-metric-label">${labels.avg}</div>
                <div class="trip-metric-val">${trip.stats.avg}</div>
            </div>
            <div class="trip-metric-card">
                <div class="trip-metric-label">${labels.top}</div>
                <div class="trip-metric-val">${trip.stats.top}</div>
            </div>
            <div class="trip-metric-card">
                <div class="trip-metric-label">${labels.part}</div>
                <div class="trip-metric-val">${trip.stats.participants}</div>
            </div>
            <div class="trip-metric-card">
                <div class="trip-metric-label">${labels.loc}</div>
                <div class="trip-metric-val" style="font-size:1.1rem; font-weight:700; margin-top:4px;">${trip.stats.location}</div>
            </div>
        </div>
        
        <div class="members-grid animate-fade-in">
    `;

    trip.reports.forEach((report, index) => {
        const nickText = (typeof report.nick === 'object') ? report.nick[APP_STATE.language] : report.nick;
        const descText = (typeof report.desc === 'object') ? report.desc[APP_STATE.language] : report.desc;
        
        html += `
            <div class="member-report-card" data-index="${index}">
                <div class="member-card-header">
                    <div>
                        <h4 class="member-card-title">${report.name}</h4>
                        <span class="member-card-subtitle">${nickText}</span>
                    </div>
                    <span class="grade-badge">${report.grade}</span>
                </div>
                <p class="member-card-body">${descText}</p>
                <div class="card-expand-indicator">
                    <i data-lucide="chevron-down"></i>
                </div>
            </div>
        `;
    });

    html += `</div>`;
    container.innerHTML = html;

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

function parseGradeToNumeric(gradeStr) {
    if (!gradeStr) return null;
    let clean = gradeStr.toString().trim();
    if (clean === "10-") return 9.7;
    if (clean.endsWith("+")) {
        return parseFloat(clean.replace("+", "")) + 0.3;
    }
    if (clean.endsWith("-")) {
        return parseFloat(clean.replace("-", "")) - 0.3;
    }
    return parseFloat(clean);
}

function renderHistoricalStats() {
    const topVoti = [];
    const presenze = {};
    const mediaSomme = {};
    const mediaCount = {};
    
    MAIN_MEMBERS.forEach(m => {
        presenze[m] = 0;
        mediaSomme[m] = 0;
        mediaCount[m] = 0;
    });

    Object.entries(TRIP_DATA).forEach(([tripKey, trip]) => {
        const tripName = (typeof trip.title === 'object') ? trip.title.it.replace(/[^a-zA-Z0-9 ]/g, "").trim() : trip.title;
        trip.reports.forEach(r => {
            const numGrade = parseGradeToNumeric(r.grade);
            
            topVoti.push({ name: r.name, trip: tripName, grade: r.grade, numeric: numGrade || 0 });
            
            if (MAIN_MEMBERS.includes(r.name)) {
                presenze[r.name]++;
                if (numGrade) {
                    mediaSomme[r.name] += numGrade;
                    mediaCount[r.name]++;
                }
            }
        });
    });

    const top10Sorted = topVoti.sort((a,b) => b.numeric - a.numeric).slice(0, 10);
    const topVotiList = document.getElementById("stats-top-voti-list");
    topVotiList.innerHTML = top10Sorted.map((item, i) => `
        <li>
            <span>${i+1}. <strong>${item.name}</strong> (${item.trip})</span>
            <strong>${item.grade}</strong>
        </li>
    `).join("");

    const presenzeSorted = Object.entries(presenze).sort((a,b) => b[1] - a[1]);
    const presenzeList = document.getElementById("stats-presenze-list");
    presenzeList.innerHTML = presenzeSorted.map(([name, count]) => `
        <li>
            <span><strong>${name}</strong></span>
            <span>${count} ${APP_STATE.language === 'it' ? 'vacanze' : 'trips'}</span>
        </li>
    `).join("");

    const classificaMedie = [];
    Object.keys(mediaCount).forEach(name => {
        if (mediaCount[name] > 0) {
            const avgVal = (mediaSomme[name] / mediaCount[name]).toFixed(2);
            classificaMedie.push({ name: name, avg: avgVal, count: mediaCount[name] });
        }
    });
    classificaMedie.sort((a,b) => b.avg - a.avg);
    
    const medieList = document.getElementById("stats-medie-list");
    medieList.innerHTML = classificaMedie.map((item, i) => `
        <li>
            <span>${i+1}. <strong>${item.name}</strong> (${item.count} ${APP_STATE.language === 'it' ? 'vacanze' : 'trips'})</span>
            <strong>${item.avg}</strong>
        </li>
    `).join("");
    
    if (APP_STATE.profile && APP_STATE.profile !== 'Guest') {
        const info = MEMBER_INFO[APP_STATE.profile];
        if (info) {
            info.stats.trips = presenze[APP_STATE.profile] || 0;
            if (mediaCount[APP_STATE.profile] > 0) {
                info.stats.avg = (mediaSomme[APP_STATE.profile] / mediaCount[APP_STATE.profile]).toFixed(2);
            }
        }
    }
}

function renderEvolutionChart() {
    const ctx = document.getElementById("historical-evolution-chart");
    if (!ctx) return;

    if (evolutionChartInstance) {
        evolutionChartInstance.destroy();
    }

    const tripKeys = Object.keys(TRIP_DATA);
    const tripLabels = tripKeys.map(key => {
        const title = TRIP_DATA[key].title;
        return (typeof title === 'object') ? title[APP_STATE.language] : title;
    });

    const datasets = MAIN_MEMBERS.map(member => {
        const dataPoints = tripKeys.map(key => {
            const report = TRIP_DATA[key].reports.find(r => r.name === member);
            return report ? parseGradeToNumeric(report.grade) : null;
        });

        return {
            label: member,
            data: dataPoints,
            borderColor: MEMBER_COLORS[member] || '#888',
            backgroundColor: MEMBER_COLORS[member] || '#888',
            borderWidth: 2.5,
            tension: 0.15,
            spanGaps: true,
            pointRadius: 4,
            pointHoverRadius: 6
        };
    });

    const isDark = document.documentElement.getAttribute("data-theme") === 'dark';
    const textColor = isDark ? '#f8f8f8' : '#1e1e1e';
    const gridColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';

    evolutionChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: tripLabels,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: { color: textColor, font: { family: 'Outfit', size: 12 } }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let val = context.parsed.y;
                            let orig = val;
                            if (val === 9.7) orig = "10-";
                            return `${context.dataset.label}: ${orig}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { color: gridColor },
                    ticks: { color: textColor, font: { family: 'Outfit' } }
                },
                y: {
                    min: 5,
                    max: 10.2,
                    grid: { color: gridColor },
                    ticks: {
                        color: textColor,
                        font: { family: 'Outfit' },
                        stepSize: 1,
                        callback: function(value) {
                            if (value === 10) return "10";
                            return value;
                        }
                    }
                }
            }
        }
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
    
    document.getElementById("profile-user-img").src = info.image;
    document.getElementById("profile-user-name").innerText = info.name;
    
    const nicksContainer = document.getElementById("profile-user-nicks");
    nicksContainer.innerHTML = info.nicknames.map(nick => `
        <span class="nickname-tag">${nick}</span>
    `).join("");
    
    let tripsCount = 0;
    let gradeSum = 0;
    let gradeCount = 0;
    let maxGradeNumeric = 0;
    let maxGradeStr = "-";
    let bestTrip = "-";

    const timelineData = [];

    Object.entries(TRIP_DATA).forEach(([tripKey, trip]) => {
        const report = trip.reports.find(r => r.name === APP_STATE.profile);
        if (report) {
            tripsCount++;
            const numGrade = parseGradeToNumeric(report.grade);
            if (numGrade) {
                gradeSum += numGrade;
                gradeCount++;
                if (numGrade > maxGradeNumeric) {
                    maxGradeNumeric = numGrade;
                    const tripTitleText = (typeof trip.title === 'object') ? trip.title.it : trip.title;
                    maxGradeStr = `${report.grade} (${tripTitleText})`;
                    bestTrip = tripTitleText;
                }
            }

            const nickText = (typeof report.nick === 'object') ? report.nick[APP_STATE.language] : report.nick;
            const descText = (typeof report.desc === 'object') ? report.desc[APP_STATE.language] : report.desc;
            const tripTitle = (typeof trip.title === 'object') ? trip.title[APP_STATE.language] : trip.title;

            timelineData.push({
                trip: tripTitle,
                grade: report.grade,
                nick: nickText,
                desc: descText
            });
        }
    });
    
    const calculatedAvg = gradeCount > 0 ? (gradeSum / gradeCount).toFixed(2) : "0.00";

    document.getElementById("profile-stat-trips").innerText = tripsCount;
    document.getElementById("profile-stat-avg").innerText = calculatedAvg;
    document.getElementById("profile-stat-max").innerText = maxGradeStr;
    document.getElementById("profile-stat-best").innerText = bestTrip;
    
    const timelineContainer = document.getElementById("profile-timeline-container");
    timelineContainer.innerHTML = timelineData.map(item => `
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
    // Quiz
    document.getElementById("quiz-start-btn").addEventListener("click", startQuizGame);
    document.getElementById("quiz-next-btn").addEventListener("click", nextQuizQuestion);
    document.getElementById("quiz-restart-btn").addEventListener("click", restartQuizGame);
    
    // Jeopardy
    document.getElementById("jeopardy-players-count").addEventListener("input", rebuildJeopardyPlayersInputs);
    document.getElementById("jeopardy-start-btn").addEventListener("click", startJeopardyGame);
    document.getElementById("jeopardy-new-game-btn").addEventListener("click", resetJeopardyToSetup);
    
    document.getElementById("jeopardy-reveal-btn").addEventListener("click", revealJeopardyAnswer);
    document.getElementById("jeopardy-yes-btn").addEventListener("click", () => answerJeopardyQuestion(true));
    document.getElementById("jeopardy-no-btn").addEventListener("click", () => answerJeopardyQuestion(false));
    
    // Voting
    document.getElementById("voting-players-count").addEventListener("input", rebuildVotingPlayersInputs);
    document.getElementById("voting-start-btn").addEventListener("click", startVotingGame);
    document.getElementById("voting-next-btn").addEventListener("click", loadNextVotingQuestion);
    document.getElementById("voting-reset-btn").addEventListener("click", resetVotingToSetup);
    document.getElementById("voting-toggle-reveal-btn").addEventListener("click", () => {
        APP_STATE.voting.revealDetailedVotes = !APP_STATE.voting.revealDetailedVotes;
        renderVotingDetailsTable();
    });
    
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
        
        const s1 = APP_STATE.quiz.team1Score;
        const s2 = APP_STATE.quiz.team2Score;
        const winnerMsg = document.getElementById("quiz-winner-msg");
        
        if (s1 > s2) {
            winnerMsg.innerHTML = APP_STATE.language === 'it' ? `🏆 Vince la <strong>${APP_STATE.quiz.team1Name}</strong> con ${s1} punti!` : `🏆 <strong>${APP_STATE.quiz.team1Name}</strong> wins with ${s1} points!`;
        } else if (s2 > s1) {
            winnerMsg.innerHTML = APP_STATE.language === 'it' ? `🏆 Vince la <strong>${APP_STATE.quiz.team2Name}</strong> con ${s2} punti!` : `🏆 <strong>${APP_STATE.quiz.team2Name}</strong> wins with ${s2} points!`;
        } else {
            winnerMsg.innerHTML = APP_STATE.language === 'it' ? `Pareggio! Entrambe le squadre hanno totalizzato ${s1} punti.` : `Tie! Both teams scored ${s1} points.`;
        }
        
        document.getElementById("quiz-final-team1-name").innerText = APP_STATE.quiz.team1Name;
        document.getElementById("quiz-final-team1-score").innerText = s1;
        document.getElementById("quiz-final-team2-name").innerText = APP_STATE.quiz.team2Name;
        document.getElementById("quiz-final-team2-score").innerText = s2;
    } else {
        setupPanel.classList.add("hidden");
        gamePanel.classList.remove("hidden");
        resultsPanel.classList.add("hidden");
        
        document.getElementById("quiz-display-team1-name").innerText = APP_STATE.quiz.team1Name;
        document.getElementById("quiz-display-team1-score").innerText = APP_STATE.quiz.team1Score;
        document.getElementById("quiz-display-team2-name").innerText = APP_STATE.quiz.team2Name;
        document.getElementById("quiz-display-team2-score").innerText = APP_STATE.quiz.team2Score;
        
        const questionWord = APP_STATE.language === 'it' ? 'Domanda' : 'Question';
        document.getElementById("quiz-question-index").innerText = `${questionWord} ${APP_STATE.quiz.questionCount + 1}/20`;
        
        const qSource = typeof activeQuizQuestion.source === 'object' ? activeQuizQuestion.source[APP_STATE.language] : activeQuizQuestion.source;
        document.getElementById("quiz-question-source").innerText = qSource;
        
        const turnTeam = APP_STATE.quiz.currentTeam === 1 ? APP_STATE.quiz.team1Name : APP_STATE.quiz.team2Name;
        const turnMsg = APP_STATE.language === 'it' ? `Turno della squadra: ${turnTeam}` : `Turn of team: ${turnTeam}`;
        document.getElementById("quiz-current-turn-msg").innerText = turnMsg;
        
        const qText = typeof activeQuizQuestion.question === 'object' ? activeQuizQuestion.question[APP_STATE.language] : activeQuizQuestion.question;
        document.getElementById("quiz-question-text").innerText = qText;
        
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
        
        const feedback = document.getElementById("quiz-feedback");
        if (APP_STATE.quiz.selectedAnswer !== null) {
            feedback.classList.remove("hidden");
            const feedbackMsg = document.getElementById("quiz-feedback-msg");
            if (APP_STATE.quiz.selectedAnswer === activeQuizQuestion.correct) {
                feedbackMsg.innerText = APP_STATE.language === 'it' ? "✅ Esatto!" : "✅ Correct!";
                feedbackMsg.className = "correct-msg";
            } else {
                feedbackMsg.innerText = APP_STATE.language === 'it' ? `❌ Sbagliato! La risposta corretta era: ${activeQuizQuestion.correct}` : `❌ Wrong! The correct answer was: ${activeQuizQuestion.correct}`;
                feedbackMsg.className = "incorrect-msg";
            }
        } else {
            feedback.classList.add("hidden");
        }
    }
}

function startQuizGame() {
    const defaultT1 = APP_STATE.language === 'it' ? "Squadra 1" : "Team 1";
    const defaultT2 = APP_STATE.language === 'it' ? "Squadra 2" : "Team 2";
    const t1 = document.getElementById("quiz-team1-name").value.trim() || defaultT1;
    const t2 = document.getElementById("quiz-team2-name").value.trim() || defaultT2;
    
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
// JEOPARDY BOARD GAME
// ==========================================================================

function rebuildJeopardyPlayersInputs() {
    const count = parseInt(document.getElementById("jeopardy-players-count").value) || 1;
    const container = document.getElementById("jeopardy-players-names-container");
    container.innerHTML = "";
    
    for (let i = 0; i < count; i++) {
        const div = document.createElement("div");
        div.className = "form-group";
        
        const labelText = APP_STATE.language === 'it' ? `Nome Giocatore ${i+1}` : `Player ${i+1} Name`;
        const valueText = APP_STATE.language === 'it' ? `Giocatore ${i+1}` : `Player ${i+1}`;
        
        div.innerHTML = `
            <label for="jeopardy-p-${i}">${labelText}</label>
            <input type="text" id="jeopardy-p-${i}" value="${valueText}">
        `;
        container.appendChild(div);
    }
}

function startJeopardyGame() {
    const charSelect = document.getElementById("jeopardy-character-select").value;
    if (charSelect !== "Girla") {
        alert(APP_STATE.language === 'it' ? "Scusa! La board Jeopardy per questo personaggio è in fase di sviluppo. Gioca con Girla!" : "Sorry! The Jeopardy board for this character is under development. Play with Girla!");
        return;
    }
    
    const count = parseInt(document.getElementById("jeopardy-players-count").value) || 1;
    const players = [];
    const scores = {};
    
    for (let i = 0; i < count; i++) {
        const defaultVal = APP_STATE.language === 'it' ? `Giocatore ${i+1}` : `Player ${i+1}`;
        const val = document.getElementById(`jeopardy-p-${i}`).value.trim() || defaultVal;
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
        
        const list = document.getElementById("jeopardy-final-scores-list");
        const sorted = Object.entries(APP_STATE.jeopardy.scores).sort((a,b) => b[1] - a[1]);
        const pointsLabel = APP_STATE.language === 'it' ? 'Punti' : 'Points';
        list.innerHTML = sorted.map(([name, score], i) => `
            <div class="score-row">
                <span>${i+1}. <strong>${name}</strong></span>
                <strong>${score} ${pointsLabel}</strong>
            </div>
        `).join("");
    } else {
        setupPanel.classList.add("hidden");
        gamePanel.classList.remove("hidden");
        resultsPanel.classList.add("hidden");
        
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
        
        const activeName = APP_STATE.jeopardy.players[APP_STATE.jeopardy.currentTurnPlayerIndex];
        document.getElementById("jeopardy-turn-banner").innerText = APP_STATE.language === 'it' ? `Turno di: ${activeName}` : `Turn of: ${activeName}`;
        
        const board = document.getElementById("jeopardy-board");
        board.innerHTML = "";
        
        const catTranslations = {
            "Generale": { it: "Generale", en: "General" },
            "Amore": { it: "Amore", en: "Love" },
            "Scuola": { it: "Scuola", en: "School" },
            "Viaggi": { it: "Viaggi", en: "Travel" },
            "Cibo": { it: "Cibo", en: "Food" }
        };
        
        JEOPARDY_CATEGORIES.forEach(cat => {
            const el = document.createElement("div");
            el.className = "jeopardy-cell category-header";
            const trans = catTranslations[cat] ? catTranslations[cat][APP_STATE.language] : cat;
            el.innerText = trans;
            board.appendChild(el);
        });
        
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
    
    const catLabel = typeof questionData.category === 'object' ? questionData.category[APP_STATE.language] : questionData.category;
    document.getElementById("jeopardy-modal-category").innerText = catLabel;
    
    const pointsLabel = APP_STATE.language === 'it' ? 'Punti' : 'Points';
    document.getElementById("jeopardy-modal-points").innerText = `${questionData.value} ${pointsLabel}`;
    
    const qText = typeof questionData.question === 'object' ? questionData.question[APP_STATE.language] : questionData.question;
    document.getElementById("jeopardy-modal-question").innerText = qText;
    
    const aText = typeof questionData.answer === 'object' ? questionData.answer[APP_STATE.language] : questionData.answer;
    document.getElementById("jeopardy-modal-answer").innerText = aText;
    
    document.getElementById("jeopardy-reveal-area").classList.remove("hidden");
    document.getElementById("jeopardy-answer-area").classList.add("hidden");
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
    
    document.getElementById("jeopardy-modal").classList.add("hidden");
    
    const maxQuestions = getJeopardyMaxQuestions(APP_STATE.jeopardy.players.length);
    if (APP_STATE.jeopardy.answeredQuestions.size >= maxQuestions || APP_STATE.jeopardy.answeredQuestions.size === 25) {
        APP_STATE.jeopardy.gameOver = true;
    } else {
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
// VOTING GAME ("LITIGHIAMO")
// ==========================================================================

let votingRoundChartInstance = null;
let votingGlobalChartInstance = null;

function rebuildVotingPlayersInputs() {
    const count = parseInt(document.getElementById("voting-players-count").value) || 2;
    const container = document.getElementById("voting-players-names-container");
    container.innerHTML = "";
    
    for (let i = 0; i < count; i++) {
        const div = document.createElement("div");
        div.className = "form-group";
        
        const labelText = APP_STATE.language === 'it' ? `Partecipante ${i+1}` : `Participant ${i+1}`;
        const valueText = APP_STATE.language === 'it' ? `Giocatore ${i+1}` : `Player ${i+1}`;
        
        div.innerHTML = `
            <label for="voting-p-${i}">${labelText}</label>
            <input type="text" id="voting-p-${i}" value="${valueText}">
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
    APP_STATE.voting.cumulativeResults = {};
    APP_STATE.voting.revealDetailedVotes = false;
    
    participants.forEach(p => {
        APP_STATE.voting.roundResults[p] = 0;
        APP_STATE.voting.cumulativeResults[p] = 0;
    });
    
    loadNewVotingQuestion();
    renderVotingGame();
}

function loadNewVotingQuestion() {
    const available = VOTING_QUESTIONS.filter(q => !APP_STATE.voting.questionsUsed.has(q));
    if (available.length === 0) {
        alert(APP_STATE.language === 'it' ? "Tutte le domande sono state usate!" : "All questions have been used!");
        resetVotingToSetup();
        return;
    }
    
    const chosen = available[Math.floor(Math.random() * available.length)];
    APP_STATE.voting.questionsUsed.add(chosen);
    APP_STATE.voting.currentQuestion = chosen;
    APP_STATE.voting.currentVoterIndex = 0;
    APP_STATE.voting.votes = {};
    APP_STATE.voting.revealDetailedVotes = false;
    
    APP_STATE.voting.participants.forEach(p => {
        APP_STATE.voting.roundResults[p] = 0;
    });
}

function renderVotingDetailsTable() {
    const tbody = document.getElementById("voting-details-table-body");
    const toggleBtn = document.getElementById("voting-toggle-reveal-btn");
    if (!tbody || !toggleBtn) return;
    
    const isRevealed = APP_STATE.voting.revealDetailedVotes;
    
    if (isRevealed) {
        toggleBtn.innerText = APP_STATE.language === 'it' ? "Nascondi Voti" : "Hide Votes";
    } else {
        toggleBtn.innerText = APP_STATE.language === 'it' ? "Rivela Chi Ha Votato Chi" : "Reveal Who Voted Who";
    }
    
    tbody.innerHTML = Object.entries(APP_STATE.voting.votes).map(([voter, voted]) => `
        <tr>
            <td><strong>${isRevealed ? voter : '🔒 ' + (APP_STATE.language === 'it' ? 'Segreto' : 'Secret')}</strong></td>
            <td><span class="badge badge-accent">${voted}</span></td>
        </tr>
    `).join("");
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
        
        const qText = APP_STATE.language === 'it' ? APP_STATE.voting.currentQuestion.it : APP_STATE.voting.currentQuestion.en;
        document.getElementById("voting-results-question-text").innerText = qText;
        
        renderVotingDetailsTable();
        
        setTimeout(renderVotingCharts, 50);
    } else {
        setupPanel.classList.add("hidden");
        gamePanel.classList.remove("hidden");
        resultsPanel.classList.add("hidden");
        
        const qText = APP_STATE.language === 'it' ? APP_STATE.voting.currentQuestion.it : APP_STATE.voting.currentQuestion.en;
        document.getElementById("voting-question-text").innerText = qText;
        
        const activeVoterName = APP_STATE.voting.participants[APP_STATE.voting.currentVoterIndex];
        document.getElementById("voting-current-voter").innerText = activeVoterName.toUpperCase();
        
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
    APP_STATE.voting.cumulativeResults[voted] = (APP_STATE.voting.cumulativeResults[voted] || 0) + 1;
    
    APP_STATE.voting.currentVoterIndex++;
    
    if (APP_STATE.voting.currentVoterIndex >= APP_STATE.voting.participants.length) {
        APP_STATE.voting.gameOver = true;
    }
    
    renderVotingGame();
}

function renderVotingCharts() {
    const roundCtx = document.getElementById("voting-round-chart");
    const globalCtx = document.getElementById("voting-global-chart");
    if (!roundCtx || !globalCtx) return;
    
    if (votingRoundChartInstance) votingRoundChartInstance.destroy();
    if (votingGlobalChartInstance) votingGlobalChartInstance.destroy();
    
    const isDark = document.documentElement.getAttribute("data-theme") === 'dark';
    const textColor = isDark ? '#f8f8f8' : '#1e1e1e';
    const gridColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
    
    // Chart 1: Round results
    const roundData = Object.entries(APP_STATE.voting.roundResults).sort((a,b) => b[1] - a[1]);
    const roundLabels = roundData.map(d => d[0]);
    const roundVotes = roundData.map(d => d[1]);
    
    votingRoundChartInstance = new Chart(roundCtx, {
        type: 'bar',
        data: {
            labels: roundLabels,
            datasets: [{
                label: APP_STATE.language === 'it' ? 'Voti Ricevuti' : 'Votes Received',
                data: roundVotes,
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
            plugins: { legend: { display: false } },
            scales: {
                x: {
                    grid: { color: gridColor },
                    ticks: { color: textColor, stepSize: 1, precision: 0 }
                },
                y: { grid: { display: false }, ticks: { color: textColor } }
            }
        }
    });
    
    // Chart 2: Global cumulative results
    const globalData = Object.entries(APP_STATE.voting.cumulativeResults).sort((a,b) => b[1] - a[1]);
    const globalLabels = globalData.map(d => d[0]);
    const globalVotes = globalData.map(d => d[1]);
    
    votingGlobalChartInstance = new Chart(globalCtx, {
        type: 'bar',
        data: {
            labels: globalLabels,
            datasets: [{
                label: APP_STATE.language === 'it' ? 'Voti Totali' : 'Total Votes',
                data: globalVotes,
                backgroundColor: 'rgba(106, 90, 205, 0.75)',
                borderColor: 'rgba(106, 90, 205, 1)',
                borderWidth: 1.5,
                borderRadius: 8
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: {
                    grid: { color: gridColor },
                    ticks: { color: textColor, stepSize: 1, precision: 0 }
                },
                y: { grid: { display: false }, ticks: { color: textColor } }
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
// TRIP VOTING (END-OF-TRIP VOTING SYSTEM)
// ==========================================================================

function initTripVoting() {
    document.getElementById("tv-add-member-btn").addEventListener("click", addTvMemberFromSelect);
    document.getElementById("tv-add-custom-btn").addEventListener("click", addTvMemberCustom);
    document.getElementById("tv-start-btn").addEventListener("click", startTvVotingFlow);
    document.getElementById("tv-go-vote-btn").addEventListener("click", enterTvVotingForm);
    document.getElementById("tv-submit-votes-btn").addEventListener("click", submitTvVotes);
    document.getElementById("tv-download-report-btn").addEventListener("click", downloadTvReportTxt);
    document.getElementById("tv-restart-btn").addEventListener("click", resetTvVoting);
}

function renderTripVoting() {
    const setup = document.getElementById("tv-setup-panel");
    const prompt = document.getElementById("tv-prompt-panel");
    const form = document.getElementById("tv-form-panel");
    const results = document.getElementById("tv-results-panel");
    
    setup.classList.add("hidden");
    prompt.classList.add("hidden");
    form.classList.add("hidden");
    results.classList.add("hidden");
    
    if (APP_STATE.tripvoting.stage === 'setup') {
        setup.classList.remove("hidden");
        
        const sel = document.getElementById("tv-member-select");
        sel.innerHTML = MAIN_MEMBERS.map(m => `<option value="${m}">${m}</option>`).join("");
        
        renderTvSetupList();
    } else if (APP_STATE.tripvoting.stage === 'prompt') {
        prompt.classList.remove("hidden");
        const activeVoter = APP_STATE.tripvoting.participants[APP_STATE.tripvoting.currentVoterIndex];
        document.getElementById("tv-prompt-voter-name").innerText = activeVoter;
    } else if (APP_STATE.tripvoting.stage === 'voting') {
        form.classList.remove("hidden");
        const activeVoter = APP_STATE.tripvoting.participants[APP_STATE.tripvoting.currentVoterIndex];
        document.getElementById("tv-form-voter-name").innerText = activeVoter;
        
        const container = document.getElementById("tv-targets-container");
        container.innerHTML = "";
        
        APP_STATE.tripvoting.participants.forEach(target => {
            if (target === activeVoter) return;
            
            const card = document.createElement("div");
            card.className = "glass-card";
            card.style.padding = "20px";
            
            const voteLabel = APP_STATE.language === 'it' ? `Voto per ${target}` : `Grade for ${target}`;
            const commentLabel = APP_STATE.language === 'it' ? 'Commento / Giustificazione' : 'Comment / Justification';
            const placeholderText = APP_STATE.language === 'it' ? 'Scrivi una frase per motivare il voto...' : 'Write a reason for this grade...';
            
            card.innerHTML = `
                <h4 style="font-size:1.15rem; margin-bottom:12px; color:var(--accent-light);">${target}</h4>
                <div style="display:flex; flex-direction:column; gap:10px;">
                    <div class="form-group" style="margin-bottom:0;">
                        <label>${voteLabel}</label>
                        <select class="tv-grade-select" data-target="${target}">
                            <option value="10">10</option>
                            <option value="10-">10-</option>
                            <option value="9.5" selected>9.5</option>
                            <option value="9+">9+</option>
                            <option value="9">9</option>
                            <option value="9-">9-</option>
                            <option value="8.5">8.5</option>
                            <option value="8+">8+</option>
                            <option value="8">8</option>
                            <option value="8-">8-</option>
                            <option value="7.5">7.5</option>
                            <option value="7">7</option>
                            <option value="6">6</option>
                            <option value="5">5</option>
                            <option value="4">4</option>
                        </select>
                    </div>
                    <div class="form-group" style="margin-bottom:0; margin-top:5px;">
                        <label>${commentLabel}</label>
                        <input type="text" class="tv-comment-input" data-target="${target}" placeholder="${placeholderText}" required style="width:100%;">
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    } else if (APP_STATE.tripvoting.stage === 'results') {
        results.classList.remove("hidden");
        
        const tableBody = document.getElementById("tv-results-table-body");
        const commentsContainer = document.getElementById("tv-results-comments-list");
        
        const sortedResults = Object.entries(APP_STATE.tripvoting.results).map(([name, data]) => {
            const avg = (data.totalGrade / data.count).toFixed(2);
            return { name, avg, count: data.count, comments: data.comments };
        }).sort((a,b) => b.avg - a.avg);
        
        tableBody.innerHTML = sortedResults.map(item => `
            <tr>
                <td><strong>${item.name}</strong></td>
                <td><span class="badge badge-accent">${item.avg}</span></td>
                <td>${item.count}</td>
            </tr>
        `).join("");
        
        commentsContainer.innerHTML = sortedResults.map(item => {
            const headingText = APP_STATE.language === 'it' ? `Commenti per: ${item.name}` : `Comments for: ${item.name}`;
            return `
                <div class="glass-card" style="padding: 20px;">
                    <h4 style="color: var(--accent-light); margin-bottom:12px;">${headingText}</h4>
                    <div style="display:flex; flex-direction:column; gap:10px;">
                        ${item.comments.map(c => {
                            const authorText = APP_STATE.language === 'it' ? `Voto ricevuto: ${c.grade} (Anonimo)` : `Grade received: ${c.grade} (Anonymous)`;
                            return `
                                <div class="tv-comment-card">
                                    <div class="tv-comment-author">${authorText}</div>
                                    <div class="tv-comment-text">"${c.text}"</div>
                                </div>
                            `;
                        }).join("")}
                    </div>
                </div>
            `;
        }).join("");
    }
}

function renderTvSetupList() {
    const list = document.getElementById("tv-participants-list");
    list.innerHTML = "";
    
    if (APP_STATE.tripvoting.participants.length === 0) {
        const noParticipantsText = APP_STATE.language === 'it' ? "Nessun partecipante aggiunto" : "No participants added";
        list.innerHTML = `<li class="text-center" style="color:var(--text-secondary); font-style:italic; padding:15px 0;">${noParticipantsText}</li>`;
        return;
    }
    
    const removeBtnText = APP_STATE.language === 'it' ? 'Rimuovi' : 'Remove';
    
    APP_STATE.tripvoting.participants.forEach((p, idx) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <span><strong>${p}</strong></span>
            <button class="btn-trash" onclick="removeTvParticipant(${idx})"><i data-lucide="trash"></i> ${removeBtnText}</button>
        `;
        list.appendChild(li);
    });
    lucide.createIcons();
}

function addTvMemberFromSelect() {
    const val = document.getElementById("tv-member-select").value;
    if (APP_STATE.tripvoting.participants.includes(val)) return;
    APP_STATE.tripvoting.participants.push(val);
    renderTvSetupList();
}

function addTvMemberCustom() {
    const input = document.getElementById("tv-custom-name");
    const val = input.value.trim();
    if (!val) return;
    if (APP_STATE.tripvoting.participants.includes(val)) return;
    APP_STATE.tripvoting.participants.push(val);
    input.value = "";
    renderTvSetupList();
}

window.removeTvParticipant = function(idx) {
    APP_STATE.tripvoting.participants.splice(idx, 1);
    renderTvSetupList();
};

function startTvVotingFlow() {
    if (APP_STATE.tripvoting.participants.length < 2) {
        alert("Aggiungi almeno 2 partecipanti!");
        return;
    }
    APP_STATE.tripvoting.currentVoterIndex = 0;
    APP_STATE.tripvoting.votes = {};
    APP_STATE.tripvoting.results = {};
    
    APP_STATE.tripvoting.participants.forEach(p => {
        APP_STATE.tripvoting.results[p] = { totalGrade: 0, count: 0, comments: [] };
    });
    
    APP_STATE.tripvoting.stage = 'prompt';
    renderTripVoting();
}

function enterTvVotingForm() {
    APP_STATE.tripvoting.stage = 'voting';
    renderTripVoting();
}

function submitTvVotes() {
    const activeVoter = APP_STATE.tripvoting.participants[APP_STATE.tripvoting.currentVoterIndex];
    const gradeSelects = document.querySelectorAll(".tv-grade-select");
    const commentInputs = document.querySelectorAll(".tv-comment-input");
    
    let allValid = true;
    commentInputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add("shake");
            setTimeout(() => input.classList.remove("shake"), 500);
            allValid = false;
        }
    });
    
    if (!allValid) return;
    
    APP_STATE.tripvoting.votes[activeVoter] = {};
    
    gradeSelects.forEach(select => {
        const target = select.getAttribute("data-target");
        const val = select.value;
        const numVal = parseGradeToNumeric(val) || 9.5;
        
        const commentInput = Array.from(commentInputs).find(i => i.getAttribute("data-target") === target);
        const commentText = commentInput ? commentInput.value.trim() : "";
        
        APP_STATE.tripvoting.votes[activeVoter][target] = { grade: val, comment: commentText };
        
        APP_STATE.tripvoting.results[target].totalGrade += numVal;
        APP_STATE.tripvoting.results[target].count++;
        APP_STATE.tripvoting.results[target].comments.push({ grade: val, text: commentText });
    });
    
    APP_STATE.tripvoting.currentVoterIndex++;
    if (APP_STATE.tripvoting.currentVoterIndex >= APP_STATE.tripvoting.participants.length) {
        APP_STATE.tripvoting.stage = 'results';
    } else {
        APP_STATE.tripvoting.stage = 'prompt';
    }
    renderTripVoting();
}

function downloadTvReportTxt() {
    let text = "========================================================================\n";
    text += "                       REPORT VOTAZIONI FINE VACANZA                    \n";
    text += "========================================================================\n";
    text += `Data: ${new Date().toLocaleDateString("it-IT")} ad ore ${new Date().toLocaleTimeString("it-IT")}\n\n`;
    
    text += "--- RIASSUNTO VOTI MEDI RICEVUTI ---\n";
    const sorted = Object.entries(APP_STATE.tripvoting.results).map(([name, data]) => {
        return { name, avg: (data.totalGrade / data.count).toFixed(2), count: data.count };
    }).sort((a,b) => b.avg - a.avg);
    
    sorted.forEach((item, idx) => {
        text += `${idx+1}. ${item.name}: media voto ${item.avg} (ricevuti ${item.count} voti)\n`;
    });
    
    text += "\n\n--- OPINIONI E COMMENTI DETTAGLIATI ---\n";
    Object.entries(APP_STATE.tripvoting.results).forEach(([name, data]) => {
        text += `\n------------------------------------\n`;
        text += `COMMENTI PER IL MEMBRO: ${name.toUpperCase()}\n`;
        text += `------------------------------------\n`;
        data.comments.forEach((c, idx) => {
            text += `  [Voto ${idx+1}]: ${c.grade} -> "${c.text}"\n`;
        });
    });
    
    text += "\n\n========================================================================\n";
    text += "I voti servono a dare spunti, ma come sempre le pagelle ufficiali\n";
    text += "saranno regolate e gestite insindacabilmente dai poteri forti.\n";
    text += "========================================================================\n";
    
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Report_Voti_Vacanza_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function resetTvVoting() {
    APP_STATE.tripvoting.participants = [];
    APP_STATE.tripvoting.currentVoterIndex = 0;
    APP_STATE.tripvoting.votes = {};
    APP_STATE.tripvoting.results = {};
    APP_STATE.tripvoting.stage = 'setup';
    renderTripVoting();
}


// ==========================================================================
// PANNELLO ADMIN: VACATION BUILDER (GIRLA ONLY)
// ==========================================================================

function initAdminPanel() {
    const builderSelect = document.getElementById("admin-member-select");
    if (!builderSelect) return;
    
    builderSelect.addEventListener("change", () => {
        const val = builderSelect.value;
        const customGroup = document.getElementById("admin-custom-member-group");
        if (val === "EXTRA_MEMBER") {
            customGroup.classList.remove("hidden");
        } else {
            customGroup.classList.add("hidden");
        }
    });

    document.getElementById("admin-add-report-btn").addEventListener("click", addReportCardToAdminList);
    document.getElementById("admin-save-trip-btn").addEventListener("click", saveVacationFromAdmin);
}

function renderAdminPanel() {
    const select = document.getElementById("admin-member-select");
    if (!select) return;
    
    let selHtml = MAIN_MEMBERS.map(m => `<option value="${m}">${m}</option>`).join("");
    const extraOptionText = APP_STATE.language === 'it' ? "[Aggiungi Persona Extra]" : "[Add Extra Person]";
    selHtml += `<option value="EXTRA_MEMBER">${extraOptionText}</option>`;
    select.innerHTML = selHtml;

    document.getElementById("admin-custom-member-group").classList.add("hidden");
    
    document.getElementById("admin-custom-member-name").value = "";
    document.getElementById("admin-member-nick").value = "";
    document.getElementById("admin-member-desc").value = "";
    
    renderAdminTempList();
    renderManageableTripsList();
    updateExportTextarea();
}

function renderAdminTempList() {
    const list = document.getElementById("admin-added-reports-list");
    list.innerHTML = "";
    
    if (APP_STATE.admin.tempReports.length === 0) {
        const noReportsText = APP_STATE.language === 'it' ? "Nessun report pre-compilato" : "No pre-compiled reports";
        list.innerHTML = `<li class="text-center" style="color:var(--text-secondary); font-style:italic; padding:10px 0;">${noReportsText}</li>`;
        return;
    }
    
    const removeBtnText = APP_STATE.language === 'it' ? 'Rimuovi' : 'Remove';
    const gradeLabel = APP_STATE.language === 'it' ? 'Voto' : 'Grade';
    
    APP_STATE.admin.tempReports.forEach((rep, idx) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <span><strong>${rep.name}</strong> (${gradeLabel}: ${rep.grade}) - <em>${rep.nick.it}</em></span>
            <button class="btn-trash" onclick="removeTempReport(${idx})"><i data-lucide="trash"></i> ${removeBtnText}</button>
        `;
        list.appendChild(li);
    });
    lucide.createIcons();
}

window.removeTempReport = function(idx) {
    APP_STATE.admin.tempReports.splice(idx, 1);
    renderAdminTempList();
};

function addReportCardToAdminList() {
    const select = document.getElementById("admin-member-select");
    const customNameInput = document.getElementById("admin-custom-member-name");
    const nickInput = document.getElementById("admin-member-nick");
    const gradeSelect = document.getElementById("admin-member-grade");
    const descTextarea = document.getElementById("admin-member-desc");

    let memberName = select.value;
    if (memberName === "EXTRA_MEMBER") {
        memberName = customNameInput.value.trim();
        if (!memberName) {
            alert(APP_STATE.language === 'it' ? "Inserisci il nome del membro personalizzato!" : "Enter the custom member name!");
            return;
        }
    }

    const nickVal = nickInput.value.trim();
    const descVal = descTextarea.value.trim();
    const gradeVal = gradeSelect.value;

    if (!nickVal || !descVal) {
        alert(APP_STATE.language === 'it' ? "Inserisci soprannome e descrizione per la pagella!" : "Enter nickname and description for the report card!");
        return;
    }

    const existsIdx = APP_STATE.admin.tempReports.findIndex(r => r.name === memberName);
    const reportData = {
        name: memberName,
        nick: { it: nickVal, en: nickVal },
        grade: gradeVal,
        desc: { it: descVal, en: descVal }
    };

    if (existsIdx !== -1) {
        APP_STATE.admin.tempReports[existsIdx] = reportData;
    } else {
        APP_STATE.admin.tempReports.push(reportData);
    }

    customNameInput.value = "";
    nickInput.value = "";
    descTextarea.value = "";
    
    renderAdminTempList();
}

function saveVacationFromAdmin() {
    const nameInput = document.getElementById("admin-trip-name");
    const locInput = document.getElementById("admin-trip-location");
    const durInput = document.getElementById("admin-trip-duration");

    const nameVal = nameInput.value.trim();
    const locVal = locInput.value.trim();
    const durVal = durInput.value.trim();

    if (!nameVal || !locVal || !durVal) {
        alert(APP_STATE.language === 'it' ? "Compila i campi principali della vacanza!" : "Fill in the main vacation fields!");
        return;
    }

    if (APP_STATE.admin.tempReports.length === 0) {
        alert(APP_STATE.language === 'it' ? "Aggiungi almeno una pagella prima di salvare!" : "Add at least one report card before saving!");
        return;
    }

    let gradeSum = 0;
    let gradeCount = 0;
    APP_STATE.admin.tempReports.forEach(r => {
        const numVal = parseGradeToNumeric(r.grade);
        if (numVal) {
            gradeSum += numVal;
            gradeCount++;
        }
    });
    const avgVal = gradeCount > 0 ? (gradeSum / gradeCount).toFixed(2) : "0.00";
    
    const sortedReports = [...APP_STATE.admin.tempReports].sort((a,b) => {
        return (parseGradeToNumeric(b.grade) || 0) - (parseGradeToNumeric(a.grade) || 0);
    });

    const tripKey = "custom_" + Date.now();
    const tripObject = {
        key: tripKey,
        title: { it: nameVal, en: nameVal },
        stats: {
            avg: avgVal,
            top: sortedReports.length > 0 ? `${sortedReports[0].grade} (${sortedReports[0].name})` : "-",
            participants: sortedReports.length,
            duration: durVal,
            location: locVal
        },
        reports: sortedReports
    };

    TRIP_DATA[tripKey] = tripObject;
    APP_STATE.activeTrip = tripKey;

    const customTrips = JSON.parse(localStorage.getItem("ap88_custom_trips")) || [];
    const existsIdx = customTrips.findIndex(t => t.title.it === nameVal);
    if (existsIdx !== -1) {
        customTrips[existsIdx] = tripObject;
    } else {
        customTrips.push(tripObject);
    }
    localStorage.setItem("ap88_custom_trips", JSON.stringify(customTrips));

    nameInput.value = "";
    locInput.value = "";
    durInput.value = "";
    APP_STATE.admin.tempReports = [];

    alert(APP_STATE.language === 'it' ? "Vacanza salvata e aggiornata nel database locale!" : "Vacation saved and updated in the local database!");
    
    buildTripTabsUI();
    renderTripContent();
    renderHistoricalStats();
    renderEvolutionChart();
    renderAdminPanel();
}

function renderManageableTripsList() {
    const list = document.getElementById("admin-manageable-trips-list");
    list.innerHTML = "";

    const customTrips = JSON.parse(localStorage.getItem("ap88_custom_trips")) || [];
    
    if (customTrips.length === 0) {
        const noTripsText = APP_STATE.language === 'it' ? "Nessuna vacanza personalizzata salvata" : "No custom vacations saved";
        list.innerHTML = `<li class="text-center" style="color:var(--text-secondary); font-style:italic; padding:15px 0;">${noTripsText}</li>`;
        return;
    }

    const removeBtnText = APP_STATE.language === 'it' ? 'Rimuovi' : 'Remove';

    customTrips.forEach((trip) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <span><strong>${trip.title.it}</strong> (${trip.stats.location})</span>
            <button class="btn-trash" onclick="deleteCustomTrip('${trip.key}')"><i data-lucide="trash"></i> ${removeBtnText}</button>
        `;
        list.appendChild(li);
    });
    lucide.createIcons();
}

window.deleteCustomTrip = function(key) {
    const confirmMsg = APP_STATE.language === 'it' ? "Sei sicuro di voler eliminare definitivamente questa vacanza?" : "Are you sure you want to permanently delete this vacation?";
    if (!confirm(confirmMsg)) return;

    delete TRIP_DATA[key];

    let customTrips = JSON.parse(localStorage.getItem("ap88_custom_trips")) || [];
    customTrips = customTrips.filter(t => t.key !== key);
    localStorage.setItem("ap88_custom_trips", JSON.stringify(customTrips));

    if (APP_STATE.activeTrip === key) {
        APP_STATE.activeTrip = Object.keys(TRIP_DATA)[0];
    }

    buildTripTabsUI();
    renderTripContent();
    renderHistoricalStats();
    renderEvolutionChart();
    renderAdminPanel();
};

function updateExportTextarea() {
    const customTrips = JSON.parse(localStorage.getItem("ap88_custom_trips")) || [];
    const textarea = document.getElementById("admin-export-textarea");
    if (textarea) {
        textarea.value = JSON.stringify(customTrips, null, 4);
    }
}
