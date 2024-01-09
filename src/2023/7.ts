import Solver from '../common/base'

interface HandType {
  rank: number
  name: string
  regex: RegExp
}

class Dealer {
  deck: string[]
  handTypes: HandType[]

  constructor(deck: string) {
    this.deck = deck.split('')
    this.handTypes = []
  }

  addHandType(rank: number, name: string, regex: RegExp) {
    this.handTypes.push({
      rank,
      name,
      regex,
    })
  }

  cardValue(c: string) {
    return this.deck.indexOf(c)
  }

  orderCards(a: string, b: string) {
    return this.cardValue(a) - this.cardValue(b)
  }

  getType(hand: string) {
    return this.handTypes.find((ht) => ht.regex.test(hand)) ?? ({} as HandType)
  }

  getTypeByRank(rank: number) {
    return this.handTypes.find((ht) => ht.rank === rank) ?? ({} as HandType)
  }
}

class Hand {
  dealer: Dealer
  rawCards: string
  orderedCards: string
  bid: number
  type: HandType

  constructor(dealer: Dealer, [cards, bid]: string[], jokersWild = false) {
    this.dealer = dealer
    this.rawCards = cards
    this.orderedCards = cards
      .split('')
      .sort((a, b) => this.dealer.orderCards(a, b))
      .join('')
    this.bid = Number(bid)

    this.type = this.getType(jokersWild)
  }

  get cardList() {
    return this.rawCards.split('')
  }

  getType(jokersWild: boolean) {
    if (!jokersWild) {
      return this.dealer.getType(this.orderedCards)
    }

    const cards = this.orderedCards.replaceAll('J', '')
    const baseType = this.dealer.getType(cards)
    const [_, bestCard] =
      cards.match(baseType.regex) ?? ({} as RegExpMatchArray)
    const bestCards = this.orderedCards
      .replaceAll('J', bestCard ?? this.dealer.deck[0])
      .split('')
      .sort((a, b) => this.dealer.orderCards(a, b))
      .join('')

    return this.dealer.getType(bestCards)
  }

  compareTo(hand: Hand) {
    if (this.type !== hand.type) {
      return this.type.rank - hand.type.rank
    }

    for (let i = 0; i < this.cardList.length; i++) {
      if (this.cardList[i] !== hand.cardList[i]) {
        return this.dealer.orderCards(this.cardList[i], hand.cardList[i])
      }
    }

    return 0
  }

  computeWinnings(rank: number) {
    return this.bid * rank
  }
}

export default class D7 extends Solver {
  constructor() {
    super(2023, 7)
  }

  initDealer(deck: string) {
    const dealer = new Dealer(deck)

    dealer.addHandType(1, 'FIVE', /(\w)\1{4}/)
    dealer.addHandType(2, 'FOUR', /(\w)\1{3}/)
    dealer.addHandType(3, 'FULL_HOUSE', /(\w)\1{2}(\w)\2|(\w)\3(\w)\4{2}/)
    dealer.addHandType(4, 'THREE', /(\w)\1{2}/)
    dealer.addHandType(5, 'TWO_PAIR', /(\w)\1{1}.*(\w)\2{1}/)
    dealer.addHandType(6, 'PAIR', /(\w)\1{1}/)
    dealer.addHandType(7, 'HIGH', /(\w)/)

    return dealer
  }

  parseHands(input = this.getInput()) {
    return input.map((i) => i.split(' '))
  }

  partOne(): string | number {
    const dealer = this.initDealer('AKQJT98765432')
    const hands = this.parseHands().map((h) => new Hand(dealer, h))

    hands.sort((a, b) => b.compareTo(a))

    return hands.map((h, i) => h.computeWinnings(i + 1)).reduce((a, b) => a + b)
  }

  partTwo(): string | number {
    const dealer = this.initDealer('AKQT98765432J')
    const hands = this.parseHands().map((h) => new Hand(dealer, h, true))

    hands.sort((a, b) => b.compareTo(a))

    for (const h of hands) {
      if (h.cardList.includes('J') && h.type.rank === 7) {
        console.log(h)
      }
    }

    return hands.map((h, i) => h.computeWinnings(i + 1)).reduce((a, b) => a + b)
  }
}
