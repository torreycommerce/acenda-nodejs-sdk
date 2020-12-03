import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import md5 from 'md5';
export interface AcendaErrorResponse {
  code: number
  status: string
  error: string
}

export class AcendaError implements AxiosError {
  constructor(public config: AxiosRequestConfig, public error: AxiosError) {
    this.code = error.code ? error.code : error.response?.status.toString()
    this.name = error.name
    this.message = error.message ? error.message : error.response?.data.error
    this.isAxiosError = error.isAxiosError
    this.response = error.response
    this.request = error.request
  }
  code?: string | undefined;
  request?: any;
  response?: AxiosResponse<any> | undefined;
  isAxiosError: boolean;
  name: string;
  message: string;
  stack?: string | undefined;
  toJSON(): object {
    return this.toJSON();
  }
}

export class Acenda {
  constructor(private store: string, private accessToken: string, private retryOnFail: boolean = true) {
  }

  private wait() {
    return new Promise((r, j) => setTimeout(r, this.retryAttempt * 5000))
  }
  private retryAttempt = 0
  public async create(endPoint: string, data: any): Promise<AxiosResponse> {
    const url = this.urlBuilder(endPoint)
    try {
      const response = await axios.post(url, data)
      this.retryAttempt = 0
      return response
    } catch (error) {
      if (error.response && error.response.status == 429 && this.retryAttempt < 5 && this.retryOnFail) {
        this.retryAttempt++
        await this.wait();
        return await this.create(endPoint, data)
      } else {
        throw new AcendaError({ url }, error);
      }
    }
  }

  public async update(endPoint: string, id: string, data: any): Promise<AxiosResponse> {
    const url = this.urlBuilder(`${endPoint}/${id}`)
    try {
      const response = await axios.put(url, data)
      this.retryAttempt = 0
      return response
    } catch (error) {
      if (error.response && error.response.status == 429 && this.retryAttempt < 5 && this.retryOnFail) {
        this.retryAttempt++
        await this.wait();
        return await this.update(endPoint, id, data)
      } else {
        throw new AcendaError({ url }, error);
      }
    }
  }

  public async delete(endPoint: string, id: string): Promise<AxiosResponse> {
    const url = this.urlBuilder(`${endPoint}/${id}`)

    try {
      const response = await axios.delete(url, { timeout: 60000 })
      this.retryAttempt = 0
      return response
    } catch (error) {
      if (error.response && error.response.status == 429 && this.retryAttempt < 5 && this.retryOnFail) {
        this.retryAttempt++
        await this.wait();
        return await this.delete(endPoint, id)
      } else {
        throw new AcendaError({ url }, error);
      }
    }
  }

  public async list(endPoint: string, params?: string, page?: number, limit?: number): Promise<AxiosResponse> {
    const url = this.urlBuilder(endPoint, params, page, limit)
    try {
      const response = await axios.get(url, { timeout: 60000 })
      this.retryAttempt = 0
      return response
    } catch (error) {
      if (error.response && error.response.status == 429 && this.retryAttempt < 5 && this.retryOnFail) {
        this.retryAttempt++
        await this.wait();
        return await this.list(endPoint, params, page, limit)
      } else {
        throw new AcendaError({ url }, error);
      }
    }
  }

  public async get(endPoint: string, id: string): Promise<AxiosResponse> {
    const url = this.urlBuilder(`${endPoint}/${id}`)
    try {
      const response = await axios.get(url)
      this.retryAttempt = 0
      return response
    } catch (error) {
      if (error.response && error.response.status == 429 && this.retryAttempt < 5 && this.retryOnFail) {
        this.retryAttempt++
        await this.wait();
        return await this.get(endPoint, id)
      } else {
        throw new AcendaError({ url }, error);
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

