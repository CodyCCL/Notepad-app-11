const fs = require('fs/promises'); // Using fs/promises for cleaner async/await syntax
const uuid = require('uuid'); // Using shorter uuid library

const notesFilePath = 'db/db.json'; // Defining path to JSON file

class Store {
  // Read all notes from the file
  async readNotes() {
    try {
      const data = await fs.readFile(notesFilePath, 'utf8');
      return JSON.parse(data) || []; // Return empty array if file is empty
    } catch (error) {
      console.error('Error reading notes:', error);
      return []; // Return empty array on error
    }
  }

  // Write all notes to the file
  async writeNotes(notes) {
    try {
      await fs.writeFile(notesFilePath, JSON.stringify(notes, null, 2)); // Add formatting for readability
    } catch (error) {
      console.error('Error writing notes:', error);
    }
  }

  // Get all notes
  async getNotes() {
    return await this.readNotes();
  }

  // Add a new note
  async addNote(note) {
    if (!note.title || !note.text) {
      throw new Error("Note 'title' and 'text' cannot be blank");
    }

    const newNote = { ...note, id: uuid.v4() }; // Use uuid.v4() for unique ID generation
    const notes = await this.readNotes();
    notes.push(newNote);
    await this.writeNotes(notes);
    return newNote;
  }

  // Remove a note
  async removeNote(id) {
    const notes = await this.readNotes();
    const filteredNotes = notes.filter((note) => note.id !== id);
    await this.writeNotes(filteredNotes);
  }
}

module.exports = new Store();
