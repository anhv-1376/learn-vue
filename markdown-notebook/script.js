Vue.filter("date", time => moment(time).format("DD/MM/YY, HH:mm"));

var app = new Vue({
    el: "#notebook",

    data() {
        return {
            content: "",
            notes: JSON.parse(localStorage.getItem("notes")) || [],
            selectedId: localStorage.getItem("selected-id") || null
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
            // Markdown rendered to HTML.
            return this.selectedNote ? marked(this.selectedNote.content) : "";
        },

        sortedNotes() {
            return this.notes
                .slice()
                .sort((a, b) => a.created - b.created)
                .sort((a, b) => (a.favorite === b.favorite ? 0 : a.favorite ? -1 : 1));
        },

        linesCount() {
            if (this.selectedNote) {
                // Count the number of new line characters.
                return this.selectedNote.content.split(/\r\n|\r|\n/).length;
            }
        },

        wordsCount() {
            if (this.selectedNote) {
                var s = this.selectedNote.content;
                // Turn new line cahracters into white-spaces.
                s = s.replace(/\n/g, " ");

                // Exclude start and end white-spaces.
                s = s.replace(/(^\s*)|(\s*$)/gi, "");

                // Turn 2 or more duplicate white-spaces into 1.
                s = s.replace(/\s\s+/gi, " ");

                // Return the number of spaces.
                return s.split(" ").length;
            }
        },

        charactersCount() {
            if (this.selectedNote) {
                return this.selectedNote.content.split("").length;
            }
        }
    },

    methods: {
        saveNotes() {
            // Don't forget to stringify to JSON before storing.
            localStorage.setItem("notes", JSON.stringify(this.notes));

            console.log("Notes saved!", new Date());

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
                content: "",
                created: time,
                favorite: false
            };

            this.notes.push(note);
        },

        selectNote(note) {
            this.selectedId = note.id;
        },

        removeNote() {
            if (this.selectedNote && confirm("Delete this note?")) {
                // Remove the note in the notes array.
                const index = this.notes.indexOf(this.selectedNote);

                if (index !== -1) {
                    this.notes.splice(index, 1); // Starting at position "index", remove one element.
                }
            }
        },

        // Create a method that only invert the value of the favorite.
        favoriteNote() {
            this.selectedNote.favorite = !this.selectedNote.favorite;
        }
    },

    watch: {
        notes: {
            handler: "saveNotes", // We can use it with the shorter syntax: watch: "saveNotes".
            deep: true
        },

        // Let's save the selection too.
        selectedId(val) {
            localStorage.setItem("selected-id", val);
        }
    },

    // Lifecycle hooks created().
    created() {
        this.content = localStorage.getItem("content");
    }
});
