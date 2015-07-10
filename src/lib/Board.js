import List from './List.js';

export default class Board{
	constructor(id, name){
		this.name = name;
		this.haveLists = [];
		this.recipeLists = [];
	}	
}