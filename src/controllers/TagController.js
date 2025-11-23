import TagModel from '../models/TagModel';

class TagController {
  addTag(text) {
    if (!text || text.trim() === '') return;
    TagModel.addTag({ text, timestamp: new Date() });
  }

  getTags() {
    return TagModel.getTags();
  }

  subscribe(callback) {
    return TagModel.subscribe(callback);
  }
}

export default new TagController();
