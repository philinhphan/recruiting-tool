export interface PersonalityQuestion {
  id: string;
  text: string;
  trait: 'Extraversion' | 'Agreeableness' | 'Conscientiousness' | 'Neuroticism' | 'Openness';
  isReverseScored: boolean;
}

export const BIG_FIVE_QUESTIONS: PersonalityQuestion[] = [
  // Extraversion
  {
    id: 'ext1',
    text: 'I see myself as someone who is talkative.',
    trait: 'Extraversion',
    isReverseScored: false,
  },
  {
    id: 'ext2',
    text: 'I see myself as someone who is reserved.',
    trait: 'Extraversion',
    isReverseScored: true,
  },
  {
    id: 'ext3',
    text: 'I see myself as someone who is full of energy.',
    trait: 'Extraversion',
    isReverseScored: false,
  },
  // Agreeableness
  {
    id: 'agr1',
    text: 'I see myself as someone who is generally trusting.',
    trait: 'Agreeableness',
    isReverseScored: false,
  },
  {
    id: 'agr2',
    text: 'I see myself as someone who tends to find fault with others.',
    trait: 'Agreeableness',
    isReverseScored: true,
  },
  {
    id: 'agr3',
    text: 'I see myself as someone who is helpful and unselfish with others.',
    trait: 'Agreeableness',
    isReverseScored: false,
  },
  // Conscientiousness
  {
    id: 'con1',
    text: 'I see myself as someone who does a thorough job.',
    trait: 'Conscientiousness',
    isReverseScored: false,
  },
  {
    id: 'con2',
    text: 'I see myself as someone who tends to be lazy.',
    trait: 'Conscientiousness',
    isReverseScored: true,
  },
  {
    id: 'con3',
    text: 'I see myself as someone who does things efficiently.',
    trait: 'Conscientiousness',
    isReverseScored: false,
  },
  // Neuroticism
  {
    id: 'neu1',
    text: 'I see myself as someone who worries a lot.',
    trait: 'Neuroticism',
    isReverseScored: false,
  },
  {
    id: 'neu2',
    text: 'I see myself as someone who is relaxed, handles stress well.',
    trait: 'Neuroticism',
    isReverseScored: true,
  },
  {
    id: 'neu3',
    text: 'I see myself as someone who gets nervous easily.',
    trait: 'Neuroticism',
    isReverseScored: false,
  },
  // Openness to Experience
  {
    id: 'opn1',
    text: 'I see myself as someone who has an active imagination.',
    trait: 'Openness',
    isReverseScored: false,
  },
  {
    id: 'opn2',
    text: 'I see myself as someone who has few artistic interests.',
    trait: 'Openness',
    isReverseScored: true,
  },
  {
    id: 'opn3',
    text: 'I see myself as someone who is curious about many different things.',
    trait: 'Openness',
    isReverseScored: false,
  },
];

export const LIKERT_SCALE_OPTIONS: { value: number; label: string }[] = [
  { value: 1, label: 'Disagree strongly' },
  { value: 2, label: 'Disagree a little' },
  { value: 3, label: 'Neither agree nor disagree' },
  { value: 4, label: 'Agree a little' },
  { value: 5, label: 'Agree strongly' },
];

export type TraitKey = 'openness' | 'neuroticism' | 'agreeableness' | 'extraversion' | 'conscientiousness';

export const TRAIT_MAPPING: Record<PersonalityQuestion['trait'], TraitKey> = {
    'Openness': 'openness',
    'Neuroticism': 'neuroticism',
    'Agreeableness': 'agreeableness',
    'Extraversion': 'extraversion',
    'Conscientiousness': 'conscientiousness',
};
