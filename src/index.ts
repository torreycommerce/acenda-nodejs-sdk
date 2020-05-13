import axios from 'axios';
import md5 from 'md5';
export class Acenda {
  constructor(private store: string, private accessToken: string) {
  }

  public async create(endPoint: string, data: any) {
    try {
      const url = this.urlBuilder(endPoint)
      const response = await axios.post(url, data)
      return response.data
    } catch (error) {
      throw error
    }
  }

  public async update(endPoint: string, id: number, data: any) {
    try {
      const url = this.urlBuilder(`${endPoint}/${id}`)
      const response = await axios.put(url, data)
      return response.data
    } catch (error) {
      throw error
    }
  }

  public async delete(endPoint: string, id: number) {
    try {
      const url = this.urlBuilder(`${endPoint}/${id}`)
      const response = await axios.delete(url)
      return response.data
    } catch (error) {
      throw error
    }
  }

  public async list(endPoint: string, params?: string) {
    try {
      const url = this.urlBuilder(endPoint, params)
      const response = await axios.get(url)
      return response.data
    } catch (error) {
      throw error
    }
  }

  public async get(endPoint: string, id: number) {
    try {
      const url = this.urlBuilder(`${endPoint}/${id}`)
      const response = await axios.get(url)
      return response.data
    } catch (error) {
      throw error
    }
  }

  private urlBuilder(endPoint: string, params?: string): string {
    try {
      const hashedSlug = md5(this.store)
      if (params) {
        params = encodeURIComponent(params)
        params = params.replace('%3D', '=').replace('%3A', ':').replace('%24', '$')
      }

      if (params) {
        params = '&' + params
      } else {
        params = ""
      }
      return `https://admin.acenda.com/preview/${hashedSlug}/api/${endPoint}?access_token=${this.accessToken}${params}`
    } catch (error) {
      throw error
    }
  }
}