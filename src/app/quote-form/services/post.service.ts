import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
  

@Injectable({

  providedIn: 'root'

})

export class PostService {

  private url = 'https://www.achado.com/?page_id=147';

  constructor(private httpClient: HttpClient) { }

  getPosts(){

    return this.httpClient.get(this.url);

  }

  create(post){

    return this.httpClient.post(this.url, post);

  }

}