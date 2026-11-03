import { db } from "./index";
import * as schema from "./schema";
import { getFlag, setFlag } from "../routes/settings";

type SeedDog = typeof schema.dogs.$inferInsert;

/**
 * Placeholder residents of the shelter. Replace photos and texts with the real
 * dogs of the Δήμος Μετεώρων shelter — the ADOPTED state is just the `adopted` flag.
 */
export const seedDogs: SeedDog[] = [
  {
    slug: "antriana",
    name: "Αντριάνα",
    nameEn: "Andriana",
    photo: "/images/dogs/antriana.jpg",
    sex: "female",
    ageEl: "2 ετών",
    ageEn: "2 years old",
    sizeEl: "Μεγαλόσωμη, ψηλή",
    sizeEn: "Large, tall",
    storyEl:
      "Ή αλλιώς «η Ψηλή»! Μένει στο τελευταίο κλουβί της αριστερής πλευράς και έχει γίνει το σημείο αναφοράς μας για όλο τον χώρο: «Πού είναι το ψαλίδι κλαδέματος;» – «Πριν από την Ψηλή». «Ποιο δέντρο ποτίσατε τελευταία;» – «Αυτό μπροστά από την Ψηλή». Η Αντριάνα πήρε το όνομά της από τη Σκλεναρίκοβα, αλλά έχει τη διπλάσια ομορφιά της. Νεαρή καλλονή δύο ετών, ψάχνει παλάτι — αλλά για ένα καλό σπίτι θα έκανε μια μικρή υποχώρηση.",
    storyEn:
      "Or otherwise known as “The Tall Girl”! She lives in the very last kennel on the left side and has become our reference point for the whole shelter: “Where are the pruning shears?” – “Right before the Tall Girl.” “Which tree did you water last?” – “The one in front of the Tall Girl.” Andriana obviously got her name from Adriana Sklenaříková, but she is twice as beautiful. A two-year-old young beauty looking for a palace — though she would make a small compromise for a good home too.",
    traitsEl: "Γλυκιά, ήρεμη, σημείο αναφοράς του κυνοκομείου",
    traitsEn: "Sweet, calm, the shelter's landmark",
    sortOrder: 0,
  },
  {
    slug: "kornilia",
    name: "Κορνηλία",
    nameEn: "Kornelia",
    photo: "/images/dogs/kornilia.jpg",
    sex: "female",
    ageEl: "4 ετών",
    ageEn: "4 years old",
    sizeEl: "Γιγαντόσωμη",
    sizeEn: "Giant-sized",
    storyEl:
      "Η μικρή μας αρκουδίτσα. Γιγαντόσωμη μεν, αλλά με καρδιά μωρού παιδιού. Δεν χορταίνει χάδια. Παρά τον όγκο της είναι ιδανική για διαμέρισμα: θα χρειαστεί δύο μεγάλες βόλτες, ενώ την υπόλοιπη ημέρα θα κοιμάται σε μια γωνία του σπιτιού. Χαμηλής ενέργειας σκυλάκι, που χρησιμεύει και για γωνιακός καναπές. Εμπιστευτείτε μας!",
    storyEn:
      "Our little bear cub. Giant-sized, yet with the heart of a baby. She just cannot get enough of cuddles. Despite her size, she is ideal for an apartment: she will need two long walks, while the rest of the day she will just sleep in a corner of the house. A low-energy doggy that can even double as a corner sofa. Trust us!",
    traitsEl: "Χαμηλής ενέργειας, τρυφερή, ιδανική για διαμέρισμα",
    traitsEn: "Low energy, affectionate, apartment-friendly",
    sortOrder: 2,
  },
  {
    slug: "lakis",
    name: "Λάκης",
    nameEn: "Lakis",
    photo: "/images/dogs/lakis.jpg",
    sex: "male",
    ageEl: "3 ετών",
    ageEn: "3 years old",
    sizeEl: "Μικρόσωμος",
    sizeEn: "Small-sized",
    storyEl:
      "Ο Λάκης είναι η φίρμα του κυνοκομείου. Όποτε γίνεται μια δημόσια εκδήλωση τον βγάζουμε έξω. Έχει συμμετάσχει σε δύο φιλοζωικούς μαραθωνίους και σε ένα μάθημα πιλάτες. Ναι, καλά ακούσατε. Τον παίρνουμε μαζί μας σε κάθε εκδήλωση, αφενός γιατί είναι κούκλος με πιασιάρικο τρίχωμα και ύφος «είμαι σκύλος καναπέ» κι αφετέρου γιατί είναι τόσο υπάκουος και φιλικός με όλους που ξέρεις ότι δεν θα σε εκθέσει ποτέ. Αν δεν τον λέγαμε Λάκη, θα τον λέγαμε «Το Μοντέλο».",
    storyEn:
      "Lakis is the celebrity of the shelter. Whenever there is a public event, we bring him out. He has participated in two charity marathons for animals and even a pilates class. Yes, you heard that right. We take him with us to every event, on one hand because he is gorgeous with eye-catching fur and an “I'm a couch potato” look, and on the other hand because he is so obedient and friendly with everyone that you know he will never let you down. If his name wasn't Lakis, we would call him “The Model”.",
    traitsEl: "Υπάκουος, φιλικός με όλους, σκύλος καναπέ",
    traitsEn: "Obedient, friendly with everyone, couch potato",
    sortOrder: 3,
  },
  {
    slug: "liza",
    name: "Λίζα",
    nameEn: "Liza",
    photo: "/images/dogs/liza.jpg",
    sex: "female",
    ageEl: "2 ετών",
    ageEn: "2 years old",
    sizeEl: "Μικρόσωμη",
    sizeEn: "Small-sized",
    storyEl:
      "Η γλυκιά μας Λίζα! Μιλάμε για αυτήν και ξεχειλίζει το μέσα μας από τη μία μέλι κι από την άλλη πίκρα. Μικρόσωμη, μια σταλίτσα ζωάκι, τριγυρίζει μόνη της μέσα σε ένα κλουβί κυνοκομείου, πάντα φοβισμένη κι απόμακρη. Κανείς δεν ξέρει τι της έχει συμβεί και δείχνει τόσο θλιμμένη. Της έχουμε βάλει για συγκατοίκους τα πιο ανόητα σκυλιά, μπας και πάρει τα πάνω της. Αλλά δεν φαίνεται να πιάνει το κόλπο. Γι' αυτό και θα θέλαμε για εκείνη το καλύτερο σπίτι. Ανθρώπους που να την αγαπήσουν βαθιά κι εκείνη να το καταλάβει. Να εμπιστευτεί και να χαλαρώσει επιτέλους. Ανθρώπους που θα της δώσουν τον χρόνο της και τον χώρο της. Ανθρώπους που θα την μεταμορφώσουν. Να έχει επιτέλους τη ζωή που της αξίζει.",
    storyEn:
      "Our sweet Liza! When we talk about her, our hearts overflow with sweetness on one hand and bitterness on the other. Small-sized, a tiny little creature, she wanders alone inside a shelter kennel, always scared and distant. No one knows what has happened to her and she looks so sad. We have paired her up with our silliest, most carefree dogs as roommates, hoping she might cheer up. But the trick doesn't seem to be working. That is why we want the absolute best home for her. People who will love her deeply and make sure she feels it. To finally trust and relax. People who will give her time and space. People who will transform her. So she can finally have the life she deserves.",
    traitsEl: "Ντροπαλή, φοβισμένη, χρειάζεται χρόνο και υπομονή",
    traitsEn: "Shy, fearful, needs time and patience",
    sortOrder: 4,
  },
  {
    slug: "milo",
    name: "Μάιλο",
    nameEn: "Milo",
    photo: "/images/dogs/milo.jpg",
    sex: "male",
    ageEl: "3 ετών",
    ageEn: "3 years old",
    sizeEl: "Μεγαλόσωμος, στιβαρός",
    sizeEn: "Large, robust",
    storyEl:
      "Τα περασμένα Χριστούγεννα αποφασίσαμε να πούμε τα κάλαντα, προκειμένου να μαζέψουμε κάποια χρήματα για το κυνοκομείο μας. Θεωρήσαμε ότι θα ήταν καλό, για λόγους μάρκετινγκ και συναισθηματικού εκβιασμού, να έχουμε μαζί μας και κάποιον εκπρόσωπο του κυνοκομείου. Ο Μάιλο ήταν η καλύτερη επιλογή. Υπάκουος, συνεργάσιμος, πανέμορφος, στιβαρός και με το κατάλληλο ύφος. Γεννημένος συναισθηματικός χειραγωγός. Μας συνόδευσε αγόγγυστα σε όλη τη γιορτινή αγορά, πήρε χάδια από όλους, φωτογραφήθηκε, τραγούδησε τα κάλαντα μαζί μας. Ήταν για εκείνον μια μέρα γιορτινή που θα τη θυμάται για πάντα. Κι έπειτα γύρισε στο κυνοκομείο. Είμαστε βέβαιοι ότι στα όνειρά του ακόμη βλέπει λαμπιόνια κι ακούει καμπάνες.",
    storyEn:
      "Last Christmas, we decided to go caroling to raise some money for our shelter. We thought it would be a good strategy, for marketing and emotional blackmail purposes, to have a shelter representative with us. Milo was the perfect choice. Obedient, cooperative, gorgeous, robust, and with just the right look. A born emotional manipulator. He accompanied us without a single complaint all through the festive market, got cuddles from everyone, took photos, and sang the carols with us. It was a festive day for him, one he will remember forever. And then, he returned to the shelter. We are certain that in his dreams, he still sees twinkling lights and hears bells.",
    traitsEl: "Υπάκουος, συνεργάσιμος, κοινωνικός με όλους",
    traitsEn: "Obedient, cooperative, sociable with everyone",
    sortOrder: 6,
  },
  {
    slug: "marinella",
    name: "Μαρινέλλα",
    nameEn: "Marinella",
    photo: "/images/dogs/marinella.jpg",
    sex: "female",
    ageEl: "1 έτους",
    ageEn: "1 year old",
    sizeEl: "Μεσαίου μεγέθους",
    sizeEn: "Medium-sized",
    storyEl:
      "Πήρε το όνομά της γιατί η μέρα που ήρθε στο κυνοκομείο ήταν η ίδια μέρα που έφυγε από τη ζωή η μεγάλη Ελληνίδα τραγουδίστρια Μαρινέλλα. Δεν ξέρουμε αν έχει ωραία φωνή. Δεν την έχουμε ακούσει εξάλλου να τραγουδάει. Για την ακρίβεια δεν έχουμε ακούσει καν τη φωνή της, αφού είναι πολύ ήσυχη και διακριτική. Είναι μεσαίου μεγέθους σκυλάκι με τους καλύτερους τρόπους. Πάνω από όλα όμως είναι όμορφη! Πολύ όμορφη!!!",
    storyEn:
      "She was named after the great Greek singer Marinella, because she arrived at the shelter on the very same day the legendary artist passed away. We don't know if she has a beautiful voice; after all, we have never actually heard her sing. In fact, we haven't even heard her voice at all, as she is very quiet and discreet. She is a medium-sized doggy with the absolute best manners. Above all, though, she is beautiful! Very, very beautiful!!!",
    traitsEl: "Ήσυχη, διακριτική, με άριστους τρόπους",
    traitsEn: "Quiet, discreet, impeccable manners",
    sortOrder: 7,
  },
  {
    slug: "barkoulis",
    name: "Μπάρκουλης",
    nameEn: "Barkoulis",
    photo: "/images/dogs/barkoulis.jpg",
    sex: "male",
    ageEl: "5 ετών",
    ageEn: "5 years old",
    sizeEl: "Μεγαλόσωμος",
    sizeEn: "Large-sized",
    storyEl:
      "Φυσικά και πήρε το όνομά του από τον μεγάλο γόη του ελληνικού κινηματογράφου. Αφού τέτοιος είναι. Ένας γόης!!! Η ψυχή αυτού του ζώου είναι τόσο όμορφη που δεν μπορεί να αποδοθεί στο ελάχιστο στον φωτογραφικό φακό. Αν κάποιος μας ρώταγε να ξεχωρίσουμε τα πιο καλόκαρδα σκυλάκια του κυνοκομείου και να φτιάχναμε ένα Top 10, ο Μπάρκουλης θα ήταν το No1. Είναι μεγαλόσωμος, αλλά είναι και τεμπέλης. Δεν χρειάζεται μεγάλες αυλές και κτήματα. Χρειάζεται μόνο μια γωνιά σε ένα ζεστό σπίτι.",
    storyEn:
      "Of course, he was named after the great heartthrob of old Greek cinema. Because that's exactly what he is. A heartthrob!!! This animal's soul is so beautiful that a camera lens cannot capture it even in the slightest. If someone asked us to single out the most kind-hearted dogs in the shelter and make a Top 10 list, Barkoulis would be Number 1. He is a large-sized dog but he is also lazy. He doesn't need huge yards and big properties. All he needs is a corner in a warm home.",
    traitsEl: "Καλόκαρδος, τεμπέλης, γόης",
    traitsEn: "Kind-hearted, lazy, a charmer",
    sortOrder: 8,
  },
  {
    slug: "bombos",
    name: "Μπόμπος",
    nameEn: "Bombos",
    photo: "/images/dogs/bombos.jpg",
    sex: "male",
    ageEl: "3 ετών",
    ageEn: "3 years old",
    sizeEl: "Μικρόσωμος, κοντοπόδαρος",
    sizeEn: "Small, short-legged",
    storyEl:
      "Τι να πει κανείς γι' αυτό το αστείο σκυλάκι. Μοιάζει με Χάσκυ που κάπου στην εφηβεία του σταμάτησε η ανάπτυξή του. Θα μπορούσαμε να τον λέμε και «Ο κοντός» ή «Ο κλόουν». Εκτός από την αστεία όψη του είναι κι ο ίδιος πολύ αστείος. Πάντα κεφάτος, με ενέργεια, χαμογελαστός. Όταν τον ψάχνουμε δεν τον βρίσκουμε κι όταν δεν τον θέλουμε ανάμεσα στα πόδια μας, δεν μας αφήνει σε ησυχία. Φιλικός με όλους τους ανθρώπους και τα ζώα κι ελαφρώς πονηρούλης. Παίζει σαν κουτάβι και χαμογελάει διαρκώς. Είναι βέβαιο πως μόνο χαρά και κέφι μπορεί να χαρίσει σε όποιον τον βάλει σπίτι του.",
    storyEn:
      "What can anyone say about this funny little dog. He looks like a Husky whose growth just stopped somewhere in his adolescence. We could easily call him \"The Shorty\" or \"The Clown\". Besides his funny looks, he is very funny himself. Always cheerful, energetic and smiling. When we look for him, we can't find him, and when we don't want him among our feet, he won't leave us alone. Friendly with all humans and animals, and a little bit of a rascal. He plays like a puppy and smiles constantly. It is certain that he can bring nothing but joy and cheer to whoever welcomes him into their home.",
    traitsEl: "Κεφάτος, παιχνιδιάρης, φιλικός με όλους",
    traitsEn: "Cheerful, playful, friendly with everyone",
    sortOrder: 9,
  },
  {
    slug: "lola",
    name: "Λόλα",
    nameEn: "Lola",
    photo: "/images/dogs/lola.jpg",
    sex: "female",
    ageEl: "2 ετών",
    ageEn: "2 years old",
    sizeEl: "Μεσαίο",
    sizeEn: "Medium-sized",
    storyEl:
      "Εκείνη τη μέρα προσπαθήσαμε να την βγάλουμε φωτογραφία και σε άλλα σημεία του κυνοκομείου, αλλά η Λόλα δεν φάνηκε διατεθειμένη να αφήσει το αγαπημένο της στρώμα. Εκεί πόζαρε για εμάς, με ένα χαμόγελο ως τα αυτιά. Γλυκιά και με καλούς τρόπους, ένα ήσυχο σκυλάκι που το μόνο που φαίνεται να χρειάζεται είναι λίγο ήλιο, λίγη θάλασσα και το στρώμα της.",
    storyEn:
      "That day we tried to photograph her in other spots around the shelter, but Lola didn't seem willing to leave her favourite mattress. That's where she posed for us, with a smile from ear to ear. Sweet, well-behaved and quiet, she is a doggy whose only needs seem to be a little bit of sun, a little bit of sea, and her mattress.",
    traitsEl: "Γλυκιά, ήσυχη, με καλούς τρόπους",
    traitsEn: "Sweet, quiet, well-behaved",
    sortOrder: 5,
  },
  {
    slug: "aris",
    name: "Άρης",
    nameEn: "Aris",
    photo: "/images/dogs/aris.jpg",
    sex: "male",
    ageEl: "3 ετών",
    ageEn: "3 years old",
    sizeEl: "Μεσαίο προς μεγάλο",
    sizeEn: "Medium to large",
    storyEl:
      "Αυτό το σεμνό αγόρι λέγεται Άρης. Ανήκει στην αγέλη υποδοχής, που ζει ελεύθερη στην είσοδο του κυνοκομείου. Όταν κάποιος φτάνει ως εκεί (πράγμα σπάνιο) και κάνει να ανοίξει την πόρτα του αυτοκινήτου για να βγει (πράγμα ακόμη πιο σπάνιο), τότε ένα τσούρμο από σκυλάκια τρέχει να τον υποδεχτεί. Το καθένα με τον χαρακτήρα του: άλλα τρέχουν να μυρίσουν, άλλα ψαχουλεύουν τις τσέπες και τα χέρια σου για να δουν τι τους έφερες, άλλα ανεβαίνουν πάνω σου για χάδια. Ο Άρης όμως θα έρθει αργά. Θα μείνει σε απόσταση μέχρι να ξεφαντώσουν οι υπόλοιποι και, αφού αραιώσει το τσούρμο, θα σε πλησιάσει διακριτικά και θα κολλήσει πάνω σου. Πάντα διακριτικός, με αυτά τα υπέροχα αλπίνικα χαρακτηριστικά του, πάντα κύριος!",
    storyEn:
      "This humble boy is named Aris. He belongs to the welcoming group that lives free at the entrance of the shelter. When someone arrives there (which is rare) and tries to open the car door to get out (which is even rarer), a whole bunch of doggies runs over to say hello. Each one with its own personality: some run to sniff around, others search your pockets and hands to see what you brought them, others jump on you for cuddles. Aris, however, comes slowly. At first he stays at a distance until the others stop acting like crazy, and once the group thins out he discreetly approaches and leans right next to you. Always discreet, with those wonderful alpine features of his — always a true gentleman!",
    traitsEl: "Διακριτικός, σεμνός, τρυφερός, ζει σε αγέλη",
    traitsEn: "Discreet, humble, affectionate, lives in a pack",
    sortOrder: 1,
  },
];

/**
 * Idempotent seed: inserts the starter dogs only once, the very first time the
 * table is empty. Once the flag is set, staff can delete every dog from the back
 * office without the placeholders reappearing.
 */
export async function seedDogsIfEmpty() {
  const done = await getFlag("dogsSeeded");
  if (done === "true") return { seeded: 0 };
  const existing = await db.select({ id: schema.dogs.id }).from(schema.dogs).limit(1);
  if (existing.length > 0) {
    await setFlag("dogsSeeded", "true");
    return { seeded: 0 };
  }
  await db.insert(schema.dogs).values(seedDogs);
  await setFlag("dogsSeeded", "true");
  return { seeded: seedDogs.length };
}
