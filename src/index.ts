import axios, { AxiosResponse } from 'axios';
import md5 from 'md5';
export class Acenda {
  constructor(private store: string, private accessToken: string) {
  }
  private wait() {
    return new Promise((r, j) => setTimeout(r, this.retryAttempt * 30000))
  }
  private retryAttempt = 0
  public async create(endPoint: string, data: any): Promise<AxiosResponse> {
    try {
      const url = this.urlBuilder(endPoint)
      const response = await axios.post(url, data)

      if (response.status !== 200 && response.status !== 201) {
        this.retryAttempt++
        return await this.create(endPoint, data)
      } else {
        this.retryAttempt = 0
      }
      return response
    } catch (error) {
      if (this.retryAttempt < 10) {
        await this.wait()
        this.retryAttempt++
        return await this.create(endPoint, data)
      } else {
        throw error
      }
    }
  }

  public async update(endPoint: string, id: string, data: any): Promise<AxiosResponse> {
    try {
      const url = this.urlBuilder(`${endPoint}/${id}`)
      const response = await axios.put(url, data)

      if (response.status !== 200 && response.status !== 201) {
        this.retryAttempt++
        return await this.update(endPoint, id, data)
      } else {
        this.retryAttempt = 0
      }
      return response
    } catch (error) {
      if (this.retryAttempt < 10) {
        await this.wait()
        this.retryAttempt++
        return await this.update(endPoint, id, data)
      } else {
        throw error
      }
    }
  }

  public async delete(endPoint: string, id: string): Promise<AxiosResponse> {
    try {
      const url = this.urlBuilder(`${endPoint}/${id}`)
      const response = await axios.delete(url, { timeout: 60000 })

      if (response.status !== 200 && response.status !== 201) {
        this.retryAttempt++
        return await this.delete(endPoint, id)
      } else {
        this.retryAttempt = 0
      }
      return response
    } catch (error) {
      if (this.retryAttempt < 10) {
        this.retryAttempt++
        await this.wait()
        return await this.delete(endPoint, id)
      } else {
        throw error
      }
    }
  }

  public async list(endPoint: string, params?: string, page?: number, limit?: number): Promise<AxiosResponse> {
    try {
      const url = this.urlBuilder(endPoint, params, page, limit)
      const response = await axios.get(url, { timeout: 60000 })

      if (response.status !== 200 && response.status !== 201) {
        this.retryAttempt++
        return await this.list(endPoint, params, page, limit)
      } else {
        this.retryAttempt = 0
      }
      return response
    } catch (error) {
      if (this.retryAttempt < 10) {
        this.retryAttempt++
        await this.wait()
        return await this.list(endPoint, params, page, limit)
      } else {
        throw error
      }
    }
  }

  public async get(endPoint: string, id: string): Promise<AxiosResponse> {
    try {
      const url = this.urlBuilder(`${endPoint}/${id}`)
      const response = await axios.get(url)

      if (response.status !== 200 && response.status !== 201) {
        this.retryAttempt++
        return await this.get(endPoint, id)
      } else {
        this.retryAttempt = 0
      }
      return response
    } catch (error) {
      if (this.retryAttempt < 10) {
        this.retryAttempt++
        await this.wait()
        return await this.get(endPoint, id)
      } else {
        throw error
      }
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