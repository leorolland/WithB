export type Person = {
    name: string,
    previous: string,
    next: string,
    traits: string[]
}

const NB_TRAITS: number = 5;
const traits = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q'];

/**
 * Shuffles an array
 * @param array the array to shuffle
 */
function shuffle(array:string[]): string[]{
    var currentIndex: number = array.length, temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

/**
 * Generates 
 * @param previousPlayer 
 * @param nextPlayer 
 */
function generateTraits(previousPlayer: Person | null,nextPlayer: Person | null){

    var randomTraits: string[] = [];
    if (previousPlayer!=null){ 
        randomTraits.push(previousPlayer.traits[Math.floor(Math.random()*NB_TRAITS)]);
    }
    if (nextPlayer!=null){
        randomTraits.push(nextPlayer.traits[Math.floor(Math.random()*NB_TRAITS)]);
    }

    while (randomTraits.length<NB_TRAITS){ //tant qu'on n'a pas 5 traits
        var randomIndex: number = Math.floor(Math.random()*traits.length); //on génère un indice pour un trait random
        if (!randomTraits.includes(traits[randomIndex])){ //si on n'a pas encore pris ce trait dans notre liste
            randomTraits.push(traits[randomIndex]);
        }
    }
    return randomTraits;
}


export function createCircle(nameList: string[]): Person[]{

    var randomNameList: string[] = shuffle(nameList);

    var circle: Person[] = [];

    //on genere une personne avec 5 traits random
    circle.push({
        "name":randomNameList[0],
        "previous":randomNameList[randomNameList.length-1],
        "next":randomNameList[1],
        "traits":generateTraits(null,null)
    });

    for (var i=1;i<randomNameList.length-1;i++){
        circle.push({
            "name":randomNameList[i],
            "previous":randomNameList[i-1],
            "next":randomNameList[(i+1)%randomNameList.length],
            "traits":generateTraits(circle[i-1],null)
        });
    }

    circle.push({
        "name":randomNameList[randomNameList.length-1],
        "previous":randomNameList[randomNameList.length-2],
        "next":randomNameList[0],
        "traits":generateTraits(circle[circle.length-2],circle[0])
    });
    return circle;
}