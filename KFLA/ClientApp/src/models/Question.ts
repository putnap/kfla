import { observable, action } from 'mobx';

export class Question {
    constructor(content: string) {
        this.QuestionContent = content;
        this.IsSelected = true;
    }

    QuestionContent: string;
    @observable IsSelected: boolean;

    @action toggleSelection() {
        this.IsSelected = !this.IsSelected;
    }
}
