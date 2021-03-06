import { inject, injectable } from 'inversify';
import IPage, { IPageModel, IPageRepository } from '../models/interfaces/Ipage';
import IPageService from './interfaces/Ipage';
import TYPES from '../constant/types';
import showdown from 'showdown'

@injectable()
export default class PageService implements IPageService {

  constructor (@inject(TYPES.PageRepository) private pageRepository: IPageRepository) {}

  public async getPage(id : string) {
    return await this.pageRepository.Page.findOne({_id : id});
  }

  public async getPages() {
    return await this.pageRepository.Page.find();
  }

  public async getPageByUrl(url : string) {
    let page = await this.pageRepository.Page.findOne({url : url});
    if (!page)
      return null;

    var converter = new showdown.Converter();
    page.body = converter.makeHtml(page.body);
    return page;
  }

  public async createPage(pageObject : IPage) {
    if(pageObject.url.charAt(0) != '/')
      pageObject.url = '/' + pageObject.url;
    return await new this.pageRepository.Page({
        title : pageObject.title,
        url : pageObject.url,
        body : pageObject.body
    }).save();
  }

  public async updatePage(id : string, pageObject : IPage) {
    if(pageObject.url.charAt(0) != '/')
      pageObject.url = '/' + pageObject.url;
    return await this.pageRepository.Page.updateOne({_id : id}, {
      title : pageObject.title,
      url : pageObject.url,
      body : pageObject.body,
    }, { runValidators: true });
  }

  public async deletePage(id : string) {
    return await this.pageRepository.Page.deleteOne({_id : id});
  }
}