import axios from 'axios';
import md5 from 'md5';
export class Acenda {
  constructor(private store: string, private accessToken: string) {
  }

  public async create(endPoint: string, data: any) {
    try {
      const url = this.urlBuilder(endPoint)
      const response = await axios.post(url, data)
      return response
    } catch (error) {
      throw error
    }
  }

  public async update(endPoint: string, id: string, data: any) {
    try {
      const url = this.urlBuilder(`${endPoint}/${id}`)
      const response = await axios.put(url, data)
      return response
    } catch (error) {
      throw error
    }
  }

  public async delete(endPoint: string, id: string) {
    try {
      const url = this.urlBuilder(`${endPoint}/${id}`)
      const response = await axios.delete(url)
      return response
    } catch (error) {
      throw error
    }
  }

  public async list(endPoint: string, params?: string, page?: number, limit?: number) {
    try {
      const url = this.urlBuilder(endPoint, params, page, limit)
      const response = await axios.get(url)
      return response
    } catch (error) {
      throw error
    }
  }

  public async get(endPoint: string, id: string) {
    try {
      const url = this.urlBuilder(`${endPoint}/${id}`)
      const response = await axios.get(url)
      return response
    } catch (error) {
      throw error
    }
  }

  private urlBuilder(endPoint: string, params?: string, page?: number, limit?: number): string {
    try {
      const hashedSlug = md5(this.store)
      if (params) {
        params = encodeURIComponent(params)
        let regexEqual = new RegExp('%3D', 'g');
        let regexSemicolumn = new RegExp('%3A', 'g');
        let regexDollar = new RegExp('%24', 'g');
        let regexLeftCurlyBracket = new RegExp('%7B', 'g');
        let regexRightCurlyBracket = new RegExp('%7D', 'g');
        params = params.replace(regexEqual, '=').replace(regexSemicolumn, ':').replace(regexDollar, '$').replace(regexLeftCurlyBracket, '{').replace(regexRightCurlyBracket, '}')
      }
      if (params) {
        params = '&' + params
      } else {
        params = ""
      }
      if (page && limit) {
        params = `${params}&page=${page}&limit=${limit}`
      }
      return `https://admin.acenda.com/preview/${hashedSlug}/api/${endPoint}?access_token=${this.accessToken}${params}`
    } catch (error) {
      throw error
    }
  }
}