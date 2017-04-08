class PagedList<T>{
    private page: number;
    private list: IList<T>;
    private items: T[];
    private itemsPerPage: number;
    private numOfPages: number;
    private count: number;

    constructor(list: IList<T>, itemsPerPage = 10) {
        this.page = 1;
        this.itemsPerPage = itemsPerPage;
        this.list = list;

        this.list.Count().then(i => {
            this.count = i;
            this.numOfPages = Math.floor(i / this.itemsPerPage);
            if (i % this.itemsPerPage > 0) this.numOfPages++;
        });

        this.Fetch();
    }

    NextPage() {
        if (this.page < this.numOfPages) {
            this.page++;
            this.Fetch();
        }
    }

    CurrentPage(): number {
        return this.page;
    }

    previousPage() {
        if (this.page > 1) {
            this.page--;
            this.Fetch();
        }
    }

    Goto(page: number) {
        if (page > 0 && page <= this.numOfPages) {
            this.page = page;
            this.Fetch();
        }
    }

    Count(): number {
        return this.count;
    }

    Pages(): number {
        return this.numOfPages;
    }

    Items(): T[] {
        return this.items;
    }

    ItemsPerPage() {
        return this.itemsPerPage;
    }

    private Fetch() {
        this.list.Slice((this.page - 1) * this.itemsPerPage, this.itemsPerPage).then(i => this.items = i);
    }
}

interface IList<T> {
    Count(): ng.IPromise<number>;
    Slice(skip: number, take: number): ng.IPromise<T[]>;
}
