import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
  

@Injectable({

  providedIn: 'root'

})

export class PostService {

  private url = 'https://customedtiles.com.au/process-order';

  constructor(private httpClient: HttpClient) { }

  getPosts(){

    return this.httpClient.get(this.url);

  }

  create(post){

    return this.httpClient.post(this.url, post);

  }

}