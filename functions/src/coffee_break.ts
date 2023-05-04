export default class CoffeeBreak {
    readonly names: Array<string> = ['Ryan', 'Mehdi', 'Lars', 'Henrik', 'Hurriat', 'Christa', 'Simon', 'Phil', 'Vlad', 'Christine', 'Anees', 'Bartosch', 'Sunil', 'Hussnain'];
    readonly emojis: Array<string> = ["☕️", "🍩", "🥐", "🥪", "🧁", "🍰", "🍪", "🍩", "🌞", "🧡", "🤍", "🦧"];
    readonly groupNames: Array<string> = [
        'Sunshine Squad ☀️', 'Happy Hour Heroes 🍻', 'Joyful Jesters 🤡', 'Radiant Rascals ✨', 'Positive Pals 👍',
        'Blissful Bunch 😊', 'Cheerful Champions 🎉', 'Jolly Jamboree 🎶', 'Sunny Side Up 🌅', 'Smiling Souls 😃',
        'High Fives and Good Vibes 🙌', 'Good Times Gang 🎊', 'Uplifting Unity 🤝', 'Happy Hearts Club ❤️', 
        'Optimistic Oasis 🌴', 'Friendly Faces 🙂', 'Harmony Huddle 🎵', 'Grin and Bear It 🐻', 'Zen Zone Zephyrs 🌬️', 
        'Carefree Crew 🌈'
    ];

    public generate(): Record<string, string[]> {
        const shuffledNames = this.shuffleArray<string>(this.names);
        const groups: Record<string, string[]> = this.createRandomGroups(shuffledNames, this.emojis, this.groupNames);

        return groups;
    }

    private createRandomGroups(names: string[], emojis: string[], rndGroupNames: string[]): Record<string, string[]> {
        const shuffledNames = this.shuffleArray(names);
        const numGroups = Math.ceil(names.length / 3);
        const groups: Record<string, string[]> = {};
    
        for (let i = 0; i < numGroups; i++) {
          const groupName = this.getRandomItem<string>(rndGroupNames);
          const groupNames = shuffledNames.slice(i * 3, i * 3 + 3);

          groups[`${groupName} ${this.getRandomEmoji(emojis)}`] = groupNames;
        }
    
        return groups;
    }
  
    private shuffleArray<T>(array: T[]): T[] {
      const shuffledArray = [...array];
      for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
      }
      return shuffledArray;
    }
    
    private getRandomItem<T>(array: T[]): T {
      return array[Math.floor(Math.random() * array.length)];
    }
    
    private getRandomEmoji(emojis: string[]): string {
      return this.getRandomItem(emojis);
    }
}