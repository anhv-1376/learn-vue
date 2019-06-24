var app = new Vue({
    el: "#notebook",

    data() {
        return {
            content: '',
            notes: [],
            selectedId: null,
        };
    },

    computed: {
        addButtonTitle() {
            return this.notes.length + " note(s) already!";
        },

        selectedNote() {
            // We return the matching note with selectedId.
            return this.notes.find(note => note.id === this.selectedId);
        },

        notePreview() {
            // Markdown rendered to HTML
            // return this.selectedNote ? marked(this.selectedNote.content) : '';
            return this.selectedNote ? marked(this.selectedNote.content) : '';
        },
    },

    methods: {
        saveNote() {
            console.log("Saving note:", this.content);
            localStorage.setItem("content", this.content);
            this.reportOperation("saving");
        },

        reportOperation(operationName) {
            console.log("The", operationName, "operation was completed!");
        },

        addNote() {
            const time = Date.now();

            const note = {
                id: String(time),
                title: "New note " + (this.notes.length + 1),
                content: '',
                created: time,
                favorite: false
            };

            this.notes.push(note);
        },

        selectNote(note) {
            this.selectedId = note.id;
        }
    },

    watch: {
        content: {
            handler: "saveNote" // We can use it with the shorter syntax: watch: "saveNote".
        }
    },

    // Lifecycle hooks created().
    created() {
        this.content = localStorage.getItem("content");
    }
});
