const MEDALS = {
    NO_MEDAL:"NO_MEDAL",
    MADERA: "MADERA",
    HIERRO: "HIERRO",
    BRONCE: "BRONCE",
    PLATA: "PLATA",
    ORO: "ORO",
    PLATINUM: "PLATINUM",
    DIAMANTE: "DIAMANTE",
    INMORTAL: "INMORTAL",
    RADIANTE: "RADIANTE"
} as const;

type MedalType = typeof MEDALS[keyof typeof MEDALS]; // Tipos exactos

const MEDAL_SEQUENCE: MedalType[] = [
    MEDALS.MADERA,
    MEDALS.HIERRO,
    MEDALS.BRONCE,
    MEDALS.PLATA,
    MEDALS.ORO,
    MEDALS.PLATINUM,
    MEDALS.DIAMANTE,
    MEDALS.INMORTAL,
    MEDALS.RADIANTE,
];

function getMedal(counter: number): MedalType {
    if (counter >= 90) return MEDALS.RADIANTE;
    if (counter >= 80) return MEDALS.INMORTAL;
    if (counter >= 70) return MEDALS.DIAMANTE;
    if (counter >= 60) return MEDALS.PLATINUM;
    if (counter >= 50) return MEDALS.ORO;
    if (counter >= 40) return MEDALS.PLATA;
    if (counter >= 30) return MEDALS.BRONCE;
    if (counter >= 20) return MEDALS.HIERRO;
    if (counter >= 10) return MEDALS.MADERA;
    
    return MEDALS.MADERA;
}

function isValidMedal(counter: number, medal: MedalType): boolean {
    switch(medal){
        case MEDALS.MADERA: return counter>=10;
        case MEDALS.HIERRO: return counter>=20;
        case MEDALS.BRONCE: return counter>=30;
        case MEDALS.PLATA: return counter>=40;
        case MEDALS.ORO: return counter>=50;
        case MEDALS.PLATINUM: return counter>=60;
        case MEDALS.DIAMANTE: return counter>=70;
        case MEDALS.INMORTAL: return counter>=80;
        case MEDALS.RADIANTE: return counter>=90;
        default: return false;
    }
}

function isNoMedal(currentMedal: MedalType): boolean {
    return currentMedal===MEDALS.NO_MEDAL;
}

function getMinimalMedal(): MedalType {
    return MEDAL_SEQUENCE[0]; 
}

function isMedalType(value: string): value is MedalType {
    return Object.values(MEDALS).includes(value as MedalType);
}

function getPreviousMedals(currentMedal: MedalType): MedalType[] {
    const index = MEDAL_SEQUENCE.indexOf(currentMedal);
    if (index === -1) return [];
    return MEDAL_SEQUENCE.slice(0, index); // MedalType[]
}

function getSuperiorMedals(currentMedal: MedalType): MedalType[] {
    const index = MEDAL_SEQUENCE.indexOf(currentMedal);
    if (index === -1) {
        return [];
    }
    return MEDAL_SEQUENCE.slice(index + 1);
}

function getHighestMedalFromSet(currentMedalTypes: Set<string>): MedalType {
    const validMedals = Array.from(currentMedalTypes).filter(isMedalType) as MedalType[];
    if (validMedals.length === 0) {
        return MEDALS.NO_MEDAL; // Valor mínimo permitido
    }
    return getHighestMedal(validMedals);
}

function getHighestMedal(medals: MedalType[]): MedalType {
    return medals.reduce((highest, current) => {
        return MEDAL_SEQUENCE.indexOf(current) > MEDAL_SEQUENCE.indexOf(highest) ? current : highest;
    }, MEDALS.NO_MEDAL); // Medalla mínima
}

function getNextMedal(currentMedal: MedalType): MedalType | null {
    const currentIndex = MEDAL_SEQUENCE.indexOf(currentMedal);
    if (currentIndex === -1 || currentIndex === MEDAL_SEQUENCE.length - 1) {
        return null; // No hay medalla siguiente si es la última o si la medalla es inválida
    }
    return MEDAL_SEQUENCE[currentIndex + 1];
}

export {
    getMedal,
    getPreviousMedals,
    isMedalType,
    getSuperiorMedals,
    getHighestMedal,
    getHighestMedalFromSet,
    getNextMedal,
    isNoMedal,
    getMinimalMedal,
    isValidMedal,
    MEDALS,
    MedalType
};
