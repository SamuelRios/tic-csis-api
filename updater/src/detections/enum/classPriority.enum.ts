export class ClassPriorityEnum {
    private static enum = [
        {
            name:"spray",
            initialPriority: "MEDIA"
        },
        {
            name:"graffiti",
            initialPriority: "MEDIA"
        },
        {
            name:"gun",
            initialPriority: "ALTA"
        },
        {
            name:"fire",
            initialPriority: "ALTA"
        },
        {
            name:"smoke",
            initialPriority: "ALTA"
        },
        {
            name:"knife",
            initialPriority: "ALTA"
        },
        {
            name:"puddle",
            initialPriority: "BAIXA"
        },
        {
            name:"mud",
            initialPriority: "BAIXA"
        },
        {
            name:"person",
            initialPriority: "BAIXA"
        }
    ];

    static getInitialPriority(categoryName: string) {
        const category =  this.enum.find(element => element.name == categoryName);
        if(category){
            return category.initialPriority;
        }
        return "Unknow"
    }
}