class TagModel {
  constructor() {
    this.tags = [];
    this.listeners = [];
  }

  addTag(tag) {
    this.tags.push(tag);
    this.notify();
  }

  getTags() {
    return this.tags;
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(listener => listener(this.tags));
  }
}

export default new TagModel();
