import axios, { AxiosResponse } from 'axios';
import md5 from 'md5';
export class Acenda {
  constructor(private store: string, private accessToken: string) {
  }

  public async create(endPoint: string, data: any) {
    try {
      const url = this.urlBuilder(endPoint)
      const response = await axios.post(url, data)
      return this.handleResponse(response)
    } catch (error) {
      console.log(error)
    }
  }

  public async update(endPoint: string, id: number, data: any) {
    try {
      const url = this.urlBuilder(`${endPoint}/${id}`)
      const response = await axios.put(url, data)
      return this.handleResponse(response)

    } catch (error) {
      console.log(error)
    }
  }

  public async delete(endPoint: string, id: number) {
    try {
      const url = this.urlBuilder(`${endPoint}/${id}`)
      const response = await axios.delete(url)
      return this.handleResponse(response)
    } catch (error) {
      console.log(error)
    }
  }

  public async list(endPoint: string) {
    try {
      const url = this.urlBuilder(endPoint)
      const response = await axios.get(url)
      return this.handleResponse(response)
    } catch (error) {
      console.log(error)
    }
  }

  public async get(endPoint: string, id: number) {
    try {
      const url = this.urlBuilder(`${endPoint}/${id}`)
      const response = await axios.get(url)
      return this.handleResponse(response)
    } catch (error) {
      console.log(error)
    }
  }

  private urlBuilder(endPoint: string): string {
    try {
      const hashedSlug = md5(this.store)
      return `https://admin.acenda.com/preview/${hashedSlug}/api/${endPoint}?access_token=${this.accessToken}`
    } catch (error) {
      throw new Error(error)
    }
  }

  private handleResponse(response: AxiosResponse) {
    if (response.status == 200 || response.status == 201) {
      return response.data
    } else {
      throw new Error(`Error ${response.status} ${response.statusText}`)
    }
  }
}