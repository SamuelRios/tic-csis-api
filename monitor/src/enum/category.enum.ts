export class CategoryEnum {
    private static enum = ["spray", "graffiti", "gun", "fire", "smoke", "knife", "puddle", "mud", "person"]; 
    static getCategoryName(categoryNumber: number): string {
        if (categoryNumber >= 0 && categoryNumber < this.enum.length) {
            return this.enum[categoryNumber];
        }
        return 'Unknown';
    }

    static getCategoryNumber(category): number{
        return this.enum.findIndex(element => element == category);
    }
}