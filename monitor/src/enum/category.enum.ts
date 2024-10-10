export class CategoryEnum {
    private static enum = [
        {
            name:"spray",
            debounceTTL: 300000,
        },
        {
            name:"graffiti",
            debounceTTL: 300000,
        },
        {
            name:"gun",
            debounceTTL: 300000,
        },
        {
            name:"fire",
            debounceTTL: 300000,
        },
        {
            name:"smoke",
            debounceTTL: 300000,
        },
        {
            name:"knife",
            debounceTTL: 300000,
        },
        {
            name:"puddle",
            debounceTTL: 300000,
        },
        {
            name:"mud",
            debounceTTL: 300000,
        },
        {
            name:"person",
            debounceTTL: 300000,
        }
    ];

    static getCategoryName(categoryNumber: number): string {
        if (categoryNumber >= 0 && categoryNumber < this.enum.length) {
            return this.enum[categoryNumber].name;
        }
        return 'Unknown';
    }

    static getCategoryNumber(category: string): number{
        return this.enum.findIndex(element => element.name == category);
    }

    static getDebounceTTL(category: number){
        if(category < this.enum.length)
            return this.enum[category].debounceTTL;
    }
}